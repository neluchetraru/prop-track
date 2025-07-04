import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { UserPlus, Users } from "lucide-react-native";
import { Input } from "@/components/ui/input";
import {
  Control,
  FieldErrors,
  useFieldArray,
  Controller,
} from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Label } from "@/components/ui/label";
import FormError from "@/components/form-error";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormDescription from "@/components/FormDescription";

export default function TenantsStep({
  errors,
  control,
  setValue,
}: {
  control: Control<any>;
  errors: FieldErrors<any>;
  setValue: (name: string, value: any) => void;
}) {
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showStartDate, setShowStartDate] = React.useState(false);
  const [showEndDate, setShowEndDate] = React.useState(false);
  // Local state for new tenant
  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "",
    leaseStartDate: "",
    leaseEndDate: "",
    monthlyRent: "",
  });

  // useFieldArray for tenants
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tenants",
  });

  // Open modal (no append)
  const handleOpenModal = () => {
    setNewTenant({
      name: "",
      email: "",
      phone: "",
      leaseStartDate: "",
      leaseEndDate: "",
      monthlyRent: "",
    });
    setShowTenantModal(true);
  };

  // Cancel modal (just close and reset)
  const handleCancelModal = () => {
    setShowTenantModal(false);
    setShowStartDate(false);
    setShowEndDate(false);
    setNewTenant({
      name: "",
      email: "",
      phone: "",
      leaseStartDate: "",
      leaseEndDate: "",
      monthlyRent: "",
    });
  };

  // Confirm modal (append and close)
  const handleConfirmModal = () => {
    append({ ...newTenant });
    setShowTenantModal(false);
    setShowStartDate(false);
    setShowEndDate(false);
    setNewTenant({
      name: "",
      email: "",
      phone: "",
      leaseStartDate: "",
      leaseEndDate: "",
      monthlyRent: "",
    });
  };

  return (
    <View className="gap-4">
      {/* Description */}
      <View>
        <Label className="text-blue-700 font-semibold mb-2">
          Property Tenants
        </Label>
        <FormDescription>
          Add tenants who are currently renting or will rent this property. You
          can specify their lease dates and rent amount. Keeping tenant records
          helps you manage your property more efficiently.
        </FormDescription>
      </View>
      <TouchableOpacity
        className="flex-row items-center gap-2 px-4 h-12 rounded-lg bg-blue-600 justify-center mb-2 shadow-lg active:scale-95"
        onPress={handleOpenModal}
        activeOpacity={0.85}
      >
        <UserPlus size={20} color="#fff" />
        <Text className="text-white font-bold">Add Tenant</Text>
        <View className="ml-2 px-2 py-0.5 rounded-full bg-white/20">
          <Text className="text-xs text-white font-semibold">
            {fields.length}
          </Text>
        </View>
      </TouchableOpacity>
      <View className="gap-2">
        {fields.length === 0 ? (
          <View className="flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Users size={40} color="#cbd5e1" />
            <Text className="text-gray-400 mt-2">No tenants added yet</Text>
          </View>
        ) : (
          fields.map((tenant: any, index: number) => (
            <View
              key={tenant.id || index}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-2"
            >
              <Text className="font-bold mb-1">{tenant.name}</Text>
              <Text>{tenant.email}</Text>
              {tenant.phone && <Text>{tenant.phone}</Text>}
              {tenant.leaseStartDate && (
                <Text>
                  Lease: {tenant.leaseStartDate} - {tenant.leaseEndDate}
                </Text>
              )}
              {tenant.monthlyRent && (
                <Text>Rent: ${tenant.monthlyRent}/month</Text>
              )}
              <TouchableOpacity
                className="mt-2 px-3 py-1 rounded bg-red-100 self-end"
                onPress={() => remove(index)}
              >
                <Text className="text-red-600 font-bold">Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      <Modal
        visible={showTenantModal}
        animationType="slide"
        transparent
        onRequestClose={handleCancelModal}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full items-center"
            style={{ flex: 1, justifyContent: "center", width: "100%" }}
          >
            <View
              className="bg-white rounded-2xl p-6"
              style={{
                width: "92%",
                maxWidth: 400,
                maxHeight: "85%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8,
                alignSelf: "center",
              }}
            >
              {/* Handle/Indicator */}
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: "#e5e7eb",
                  }}
                />
              </View>
              <Text className="text-xl font-bold mb-6 text-center">
                Add Tenant
              </Text>
              {/* Form Fields */}
              <KeyboardAwareScrollView
                style={{ maxHeight: 350 }}
                contentContainerStyle={{ paddingBottom: 12 }}
                enableOnAndroid
                extraScrollHeight={24}
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-6">
                  {/* Name */}
                  <View>
                    <Label className="text-blue-700 font-semibold mb-2">
                      Name
                    </Label>
                    <Input
                      placeholder="Enter tenant name"
                      value={newTenant.name}
                      onChangeText={(text) =>
                        setNewTenant((t) => ({ ...t, name: text }))
                      }
                    />
                  </View>
                  {/* Email */}
                  <View>
                    <Label className="text-blue-700 font-semibold mb-2">
                      Email
                    </Label>
                    <Input
                      placeholder="Enter tenant email"
                      value={newTenant.email}
                      onChangeText={(text) =>
                        setNewTenant((t) => ({ ...t, email: text }))
                      }
                    />
                  </View>
                  {/* Phone */}
                  <View>
                    <Label className="text-blue-700 font-semibold mb-2">
                      Phone
                    </Label>
                    <Input
                      placeholder="Enter tenant phone"
                      value={newTenant.phone}
                      onChangeText={(text) =>
                        setNewTenant((t) => ({ ...t, phone: text }))
                      }
                    />
                  </View>
                  {/* Lease Start Date */}
                  <View>
                    <Label className="text-blue-700 font-semibold mb-2">
                      Lease Start Date
                    </Label>
                    <TouchableOpacity
                      className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 justify-center"
                      onPress={() => setShowStartDate(true)}
                    >
                      <Text
                        className={
                          newTenant.leaseStartDate
                            ? "text-gray-900"
                            : "text-gray-400"
                        }
                      >
                        {newTenant.leaseStartDate || "Select start date"}
                      </Text>
                    </TouchableOpacity>
                    {showStartDate && (
                      <DateTimePicker
                        value={
                          newTenant.leaseStartDate
                            ? new Date(newTenant.leaseStartDate)
                            : new Date()
                        }
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={(event, selectedDate) => {
                          setShowStartDate(false);
                          if (selectedDate) {
                            setNewTenant((t) => ({
                              ...t,
                              leaseStartDate: selectedDate
                                .toISOString()
                                .split("T")[0],
                            }));
                          }
                        }}
                      />
                    )}
                  </View>
                  {/* Lease End Date */}
                  <View>
                    <Label className="text-blue-700 font-semibold mb-2">
                      Lease End Date
                    </Label>
                    <TouchableOpacity
                      className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 justify-center"
                      onPress={() => setShowEndDate(true)}
                    >
                      <Text
                        className={
                          newTenant.leaseEndDate
                            ? "text-gray-900"
                            : "text-gray-400"
                        }
                      >
                        {newTenant.leaseEndDate || "Select end date"}
                      </Text>
                    </TouchableOpacity>
                    {showEndDate && (
                      <DateTimePicker
                        value={
                          newTenant.leaseEndDate
                            ? new Date(newTenant.leaseEndDate)
                            : new Date()
                        }
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={(event, selectedDate) => {
                          setShowEndDate(false);
                          if (selectedDate) {
                            setNewTenant((t) => ({
                              ...t,
                              leaseEndDate: selectedDate
                                .toISOString()
                                .split("T")[0],
                            }));
                          }
                        }}
                      />
                    )}
                  </View>
                  {/* Monthly Rent */}
                  <View>
                    <Label className="text-blue-700 font-semibold mb-2">
                      Monthly Rent
                    </Label>
                    <Input
                      placeholder="Enter monthly rent"
                      value={newTenant.monthlyRent}
                      onChangeText={(text) =>
                        setNewTenant((t) => ({ ...t, monthlyRent: text }))
                      }
                    />
                  </View>
                </View>
              </KeyboardAwareScrollView>
              {/* Actions */}
              <View className="flex-row justify-between gap-4 mt-10">
                <TouchableOpacity
                  className="px-4 h-10 rounded-lg bg-gray-200 justify-center items-center mr-2"
                  onPress={handleCancelModal}
                >
                  <Text className="font-bold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-4 h-10 rounded-lg bg-blue-600 justify-center items-center"
                  onPress={handleConfirmModal}
                >
                  <Text className="font-bold text-white">Add Tenant</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
