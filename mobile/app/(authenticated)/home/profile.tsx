import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { authClient } from "../../../lib/auth-client";
import { Toast } from "toastify-react-native";
import {
  User as UserIcon,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  Edit2,
  LogOut,
  Link2,
  Trash2,
  ChevronRight,
} from "lucide-react-native";

export default function ProfileScreen() {
  const { data: session, refetch } = authClient.useSession();
  const user = session?.user;
  const [editField, setEditField] = useState<
    null | "name" | "email" | "password"
  >(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // Handlers
  const handleEdit = (field: "name" | "email" | "password") => {
    setForm({
      ...form,
      name: user.name || "",
      email: user.email || "",
      password: "",
      newPassword: "",
    });
    setEditField(field);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editField === "name") {
        Toast.error("Name editing is not supported by the backend yet.");
      } else if (editField === "email") {
        await authClient.changeEmail({
          newEmail: form.email,
        });
        Toast.success("Email updated");
      } else if (editField === "password") {
        await authClient.changePassword({
          currentPassword: form.password,
          newPassword: form.newPassword,
        });
        Toast.success("Password updated");
      }
      setEditField(null);
      refetch && refetch();
    } catch (e: any) {
      Toast.error(e?.message || "Failed to update");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await authClient.deleteUser();
      Toast.success("Account deleted");
    } catch (e: any) {
      Toast.error(e?.message || "Failed to delete account");
    }
    setLoading(false);
    setShowDeleteModal(false);
  };

  const handleForgetPassword = async () => {
    setLoading(true);
    try {
      await authClient.forgetPassword({ email: user.email });
      Toast.success("Password reset email sent");
    } catch (e: any) {
      Toast.error(e?.message || "Failed to send reset email");
    }
    setLoading(false);
  };

  const handleLinkSocial = async () => {
    setLoading(true);
    try {
      await authClient.linkSocial({ provider: "google" });
      Toast.success("Social account linked");
    } catch (e: any) {
      Toast.error(e?.message || "Failed to link social");
    }
    setLoading(false);
    setShowSocialModal(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f6f8fa" }}
      contentContainerStyle={{ padding: 24 }}
    >
      <View style={styles.card}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarFallback}>
              <UserIcon size={48} color="#2563eb" />
            </View>
          )}
        </View>
        {/* Name */}
        <View style={styles.rowBetween}>
          <Text style={styles.name}>{user.name || "No name set"}</Text>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => handleEdit("name")}
          >
            <Edit2 size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
        {/* Email */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Mail size={18} color="#2563eb" style={{ marginRight: 8 }} />
              <Text style={styles.label}>Email</Text>
            </View>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleEdit("email")}
            >
              <Edit2 size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>{user.email}</Text>
          <View style={styles.rowLeft}>
            {user.emailVerified ? (
              <CheckCircle size={16} color="#22c55e" />
            ) : (
              <XCircle size={16} color="#dc2626" />
            )}
            <Text
              style={[
                styles.status,
                { color: user.emailVerified ? "#22c55e" : "#dc2626" },
              ]}
            >
              {" "}
              {user.emailVerified ? "Verified" : "Not verified"}
            </Text>
          </View>
        </View>
        {/* Password */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Lock size={18} color="#2563eb" style={{ marginRight: 8 }} />
              <Text style={styles.label}>Password</Text>
            </View>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleEdit("password")}
            >
              <Edit2 size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={handleForgetPassword}
          >
            <Text style={styles.linkBtnText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        {/* Social */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <Link2 size={18} color="#2563eb" style={{ marginRight: 8 }} />
              <Text style={styles.label}>Social</Text>
            </View>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setShowSocialModal(true)}
            >
              <ChevronRight size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>
          <Text style={styles.value}>Google</Text>
        </View>
        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.meta}>
            Created: {new Date(user.createdAt).toLocaleString()}
          </Text>
          <Text style={styles.meta}>
            Updated: {new Date(user.updatedAt).toLocaleString()}
          </Text>
        </View>
        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => setShowDeleteModal(true)}
        >
          <Trash2 size={18} color="#dc2626" style={{ marginRight: 8 }} />
          <Text style={styles.deleteBtnText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={!!editField}
        transparent
        animationType="slide"
        onRequestClose={() => setEditField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            {editField === "name" && (
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                editable={false} // Name editing not supported
              />
            )}
            {editField === "email" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="New Email"
                  value={form.email}
                  onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  value={form.password}
                  onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
                  secureTextEntry
                />
              </>
            )}
            {editField === "password" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  value={form.password}
                  onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  value={form.newPassword}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, newPassword: v }))
                  }
                  secureTextEntry
                />
              </>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setEditField(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.modalTitle, { color: "#dc2626" }]}>
              Delete Account
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, { backgroundColor: "#dc2626" }]}
                onPress={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Social Modal */}
      <Modal
        visible={showSocialModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSocialModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Link Google Account</Text>
            <Text style={{ marginBottom: 16 }}>
              Link your Google account for easier sign in and recovery.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowSocialModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={handleLinkSocial}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>Link</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 32,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  section: {
    marginTop: 12,
    marginBottom: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563eb",
  },
  value: {
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
    marginLeft: 2,
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  linkBtn: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
  },
  linkBtnText: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: 14,
  },
  meta: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 18,
  },
  deleteBtnText: {
    color: "#dc2626",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    width: 320,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#2563eb",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 18,
    gap: 12,
  },
  modalCancel: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  modalCancelText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
  },
  modalSave: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  modalSaveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
