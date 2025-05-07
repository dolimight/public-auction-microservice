import {
  Group,
  Button,
  AspectRatio,
  Center,
  Stack,
  Image,
  Text,
  TextInput,
  Select,
  SelectProps,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { DatePickerInput } from "@mantine/dates";
import { z } from "zod";
import {
  itemMutation,
  itemMutationDataSchema,
} from "../../api/item/item.mutation";
import { base64ToDataUrl, blobToBase64 } from "../../utils/image";
import {
  Upload,
  Image as ImageIcon,
  XCircle,
  CurrencyDollar,
} from "@phosphor-icons/react";
import { useMutation, useQueries } from "@tanstack/react-query";
import { categoriesQuery } from "../../api/item/categories.query";
import { conditionsQuery } from "../../api/item/conditions.query";
import { useUserStore } from "../../hooks/useUserStore";
import dayjs from "dayjs";

const createAuctionFormSchema = itemMutationDataSchema;

export type CreateAuctionFormSchema = z.infer<typeof createAuctionFormSchema>;

export type CreateAuctionFormProps = {
  onSuccess: () => void;
};

export function CreateAuctionForm({ onSuccess }: CreateAuctionFormProps) {
  const { user } = useUserStore();
  const [categories, conditions] = useQueries({
    queries: [categoriesQuery(), conditionsQuery()],
  });
  const item = useMutation({ mutationFn: itemMutation(), onSuccess });

  const form = useForm<CreateAuctionFormSchema>({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      image: "",
      shortDescription: "",
      longDescription: "",
      startingBid: 0,
      buyNowPrice: null,
      bidIncrement: 1,
      startDate: dayjs().toDate(),
      endDate: dayjs().add(7, "day").toDate(),
      sellerId: user?.id ?? "",
      categoryId: -1,
      subCategoryId: -1,
      conditionId: -1,
    },
    validate: zodResolver(createAuctionFormSchema),
  });

  const handleSubmit = (values: typeof form.values) => {
    item.mutateAsync(values);
  };

  const handleImageDrop: DropzoneProps["onDrop"] = async (files) => {
    if (files.length > 0) {
      const file = files[0];
      const blob = new Blob([file], { type: file.type });
      const base64 = await blobToBase64(blob);
      form.setFieldValue("image", base64ToDataUrl(base64, file.type));
    }
  };

  const categoriesSelectData: SelectProps["data"] = categories.data?.map(
    (category) => ({
      value: category.id.toString(),
      label: category.name,
    })
  );

  const conditionsSelectData: SelectProps["data"] = conditions.data?.map(
    (condition) => ({
      value: condition.id.toString(),
      label: condition.name,
    })
  );

  console.log(form.errors);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Dropzone
          accept={IMAGE_MIME_TYPE}
          maxFiles={1}
          maxSize={5_000_000} // 5mb
          mih={150}
          onDrop={handleImageDrop}
          onReject={() => form.setFieldValue("image", "")}
        >
          <Stack ta="center" style={{ pointerEvents: "none" }}>
            <Center>
              {form.getValues().image ? (
                <AspectRatio h={50}>
                  <Image
                    radius="sm"
                    src={form.getValues().image}
                    alt="Item Image"
                    h="100%"
                  />
                </AspectRatio>
              ) : (
                <>
                  <Dropzone.Accept>
                    <Upload size={52} color="var(--mantine-color-brand-6)" />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <XCircle
                      size={52}
                      style={{ color: "var(--mantine-color-red)" }}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <ImageIcon
                      size={52}
                      style={{ color: "var(--mantine-color-dimmed)" }}
                    />
                  </Dropzone.Idle>
                </>
              )}
            </Center>
            <Stack gap="xs">
              <Text size="xl">Drag image here or click to select file</Text>
              <Text size="sm" c="dimmed">
                Your chosen image should not exceed 5mb
              </Text>
              {form.errors.image && (
                <Text size="sm" c="red">
                  {form.errors.image}
                </Text>
              )}
            </Stack>
          </Stack>
        </Dropzone>
        <TextInput
          {...form.getInputProps("title")}
          label="Title"
          placeholder="Enter the title of your auction item"
          required
        />
        <TextInput
          {...form.getInputProps("shortDescription")}
          label="Short Description"
          placeholder="Enter a short description of your auction item"
          required
        />
        <Textarea
          {...form.getInputProps("longDescription")}
          label="Long Description"
          placeholder="Enter a long description of your auction item"
          minRows={4}
          required
        />
        <Group grow>
          <Select
            {...form.getInputProps("categoryId")}
            label="Category"
            placeholder="Select a category"
            data={categoriesSelectData}
            disabled={categories.isPending || categories.isError}
            required
          />
          <Select
            {...form.getInputProps("subCategoryId")}
            label="Sub-Category"
            placeholder="Select a sub-category"
            data={categoriesSelectData}
            disabled={categories.isPending || categories.isError}
            required
          />
        </Group>
        <Group grow>
          <NumberInput
            {...form.getInputProps("startingBid")}
            leftSection={<CurrencyDollar />}
            label="Starting Bid"
            placeholder="Starting bid amount"
            required
            min={0}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=","
          />
          <NumberInput
            {...form.getInputProps("buyNowPrice")}
            leftSection={<CurrencyDollar />}
            label="Buy Now Price"
            placeholder="Buy now price"
            min={0}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=","
          />
        </Group>
        <Group grow>
          <NumberInput
            {...form.getInputProps("bidIncrement")}
            leftSection={<CurrencyDollar />}
            label="Bid Increment"
            placeholder="Min bid increment"
            required
            min={0}
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator=","
          />
          <Select
            {...form.getInputProps("conditionId")}
            label="Condition"
            placeholder="Select a condition"
            data={conditionsSelectData}
            disabled={conditions.isPending || conditions.isError}
            required
          />
        </Group>
        <DatePickerInput
          {...form.getInputProps("endDate")}
          label="End Date"
          required
        />
        <Group justify="end" mt="md">
          <Button
            type="submit"
            loading={item.isPending}
            disabled={item.isPending}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
