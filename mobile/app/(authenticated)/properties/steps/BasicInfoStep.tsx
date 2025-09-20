import FormDescription from "../../../../components/FormDescription";
import FormError from "../../../../components/form-error";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../../../components/ui/select";
import { Separator } from "../../../../components/ui/separator";
import { Textarea } from "../../../../components/ui/textarea";
import { cn } from "../../../../lib/utils";
import { Building, Building2, Home } from "lucide-react-native";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { PropertyFormData } from "../../../../api/properties";

const PROPERTY_TYPES = [
  {
    value: "HOUSE",
    label: "House",
    icon: <Home size={24} color="#2563eb" />,
  },
  {
    value: "APARTMENT",
    label: "Apartment",
    icon: <Building2 size={24} color="#2563eb" />,
  },
  {
    value: "VILLA",
    label: "Villa",
    icon: <Building size={24} color="#2563eb" />,
  },
  {
    value: "COMMERCIAL",
    label: "Commercial",
    icon: <Building size={24} color="#2563eb" />,
  },
];

const CURRENCIES = [
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "€ EUR" },
  { value: "GBP", label: "£ GBP" },
  { value: "JPY", label: "¥ JPY" },
];

export default function BasicInfoStep({
  control,
  errors,
}: {
  control: Control<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
}) {
  return (
    <View className="gap-6">
      {/* Property Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Label className="text-blue-700 font-semibold mb-2">
              Property Name
            </Label>
            <Input
              placeholder="Enter property name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            {errors.name && <FormError error={errors.name.message as string} />}
            <FormDescription>e.g. "Cozy Family House"</FormDescription>
          </View>
        )}
      />

      {/* Property Type */}
      <Separator />
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <View className="gap-1">
            <Label className="text-blue-700 font-semibold">Property Type</Label>
            <View className="flex-row flex-wrap gap-2">
              {PROPERTY_TYPES.map(
                ({ value: typeValue, label: optionLabel, icon }) => {
                  const isSelected = value === typeValue;
                  return (
                    <TouchableOpacity
                      key={typeValue}
                      className={cn(
                        "flex-row items-center gap-2 px-4 py-2 rounded-lg border",
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white"
                      )}
                      onPress={() => onChange(typeValue)}
                      activeOpacity={0.85}
                    >
                      {icon}
                      <Text className="font-medium text-base">
                        {optionLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
            <FormDescription>
              Select the type that best describes your property.
            </FormDescription>
          </View>
        )}
      />
      <Separator />

      {/* Value */}
      <View className="gap-2">
        <Label className="text-blue-700 font-semibold">Value</Label>
        <View className="flex flex-row items-center gap-2">
          <Controller
            control={control}
            name="value"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter value"
                value={value?.toString()}
                onChangeText={(val) => onChange(Number(val))}
                onBlur={onBlur}
                className="flex-1"
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="currency"
            render={({ field: { onChange, value } }) => (
              <Select
                value={CURRENCIES.find((c) => c.value === value)}
                onValueChange={(val) => onChange(val?.value)}
              >
                <SelectTrigger>
                  <Text className="text-base font-semibold text-blue-700">
                    {CURRENCIES.find((c) => c.value === value)?.label ||
                      "Select Currency"}
                  </Text>
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value} label={c.label}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </View>
        {errors.value && <FormError error={errors.value.message as string} />}
        <FormDescription>
          Estimated market value of the property.
        </FormDescription>
      </View>
      <Separator />

      {/* Notes */}
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="gap-2">
            <Label className="text-blue-700 font-semibold">Notes</Label>
            <Textarea
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Add any extra details about the property..."
            />
            {errors.notes && (
              <FormError error={errors.notes.message as string} />
            )}
            <FormDescription>
              Add any extra details, features, or remarks.
            </FormDescription>
          </View>
        )}
      />
    </View>
  );
}
