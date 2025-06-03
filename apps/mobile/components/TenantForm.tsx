import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";

const tenantSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .nonempty("Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  leaseStartDate: z.string().optional(),
  leaseEndDate: z.string().optional(),
  monthlyRent: z.number().optional(),
});

type TenantFormData = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TenantFormData) => void;
  initialData?: TenantFormData;
}

export function TenantForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: TenantFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      leaseStartDate: "",
      leaseEndDate: "",
      monthlyRent: undefined,
    },
  });

  const [showStartDate, setShowStartDate] = React.useState(false);
  const [showEndDate, setShowEndDate] = React.useState(false);

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={() => onOpenChange(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="w-full max-w-xl bg-white rounded-2xl p-6">
          <Text className="text-xl font-bold mb-6 text-center">
            {initialData ? "Edit" : "Add"} Tenant
          </Text>
          {/* Form Fields */}
          <View className="mb-4">
            <Text className="mb-1 font-semibold">Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter tenant name"
                  editable={true}
                  placeholderTextColor="#888"
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-600 mt-1 text-sm">
                {errors.name.message}
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="mb-1 font-semibold">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter tenant email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={true}
                  placeholderTextColor="#888"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-600 mt-1 text-sm">
                {errors.email.message}
              </Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="mb-1 font-semibold">Phone</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter tenant phone"
                  keyboardType="phone-pad"
                  editable={true}
                  placeholderTextColor="#888"
                />
              )}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1 font-semibold">Lease Start Date</Text>
            <Controller
              control={control}
              name="leaseStartDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 justify-center"
                    onPress={() => setShowStartDate(true)}
                  >
                    <Text className={value ? "text-gray-900" : "text-gray-400"}>
                      {value ? value : "Select start date"}
                    </Text>
                  </TouchableOpacity>
                  {showStartDate && (
                    <DateTimePicker
                      value={value ? new Date(value) : new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "default"}
                      onChange={(event, selectedDate) => {
                        setShowStartDate(false);
                        if (selectedDate) {
                          onChange(selectedDate.toISOString().split("T")[0]);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1 font-semibold">Lease End Date</Text>
            <Controller
              control={control}
              name="leaseEndDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 justify-center"
                    onPress={() => setShowEndDate(true)}
                  >
                    <Text className={value ? "text-gray-900" : "text-gray-400"}>
                      {value ? value : "Select end date"}
                    </Text>
                  </TouchableOpacity>
                  {showEndDate && (
                    <DateTimePicker
                      value={value ? new Date(value) : new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "default"}
                      onChange={(event, selectedDate) => {
                        setShowEndDate(false);
                        if (selectedDate) {
                          onChange(selectedDate.toISOString().split("T")[0]);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
          </View>

          <View className="mb-6">
            <Text className="mb-1 font-semibold">Monthly Rent</Text>
            <Controller
              control={control}
              name="monthlyRent"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50"
                  value={
                    value !== undefined && value !== null
                      ? value.toString()
                      : ""
                  }
                  onChangeText={(text) =>
                    onChange(text ? parseFloat(text) : undefined)
                  }
                  onBlur={onBlur}
                  placeholder="Enter monthly rent"
                  keyboardType="numeric"
                  editable={true}
                  placeholderTextColor="#888"
                />
              )}
            />
          </View>

          {/* Actions */}
          <View className="flex-row justify-end gap-4 mt-2">
            <TouchableOpacity
              className="px-4 h-10 rounded-lg bg-gray-200 justify-center items-center mr-2"
              onPress={() => onOpenChange(false)}
            >
              <Text className="font-bold text-gray-700">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 h-10 rounded-lg bg-blue-600 justify-center items-center"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="font-bold text-white">
                {initialData ? "Save" : "Add"} Tenant
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
