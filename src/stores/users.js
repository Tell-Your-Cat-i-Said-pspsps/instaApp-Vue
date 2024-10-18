import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../../supabase";

export const useUserStore = defineStore("users", () => {
  const loading = ref(false);
  const loadingUser = ref(false);
  const errorMessage = ref("");
  const user = ref(null);
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  //LOGIN
  const handleLogin = async (credentials) => {
    const { email, password } = credentials;
    if (!validateEmail(email)) {
      return (errorMessage.value = "Not a valid email address");
    }
    if (!password.length) {
      return (errorMessage.value = "Password cannot be empty");
    }
    // backend validation
    loading.value = true;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();
    user.value = {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username
    };
    loading.value = false;
    clearErrorMessage();
  };
  //SIGNUP
  const handleSignup = async (credentials) => {
    const { email, username, password } = credentials;
    if (password.length < 8) {
      return (errorMessage.value = "Password length is too short");
    }
    if (username.length < 4) {
      return (errorMessage.value = "Username length is too short");
    }
    if (!validateEmail(email)) {
      return (errorMessage.value = "Not a valid email address");
    }
    // TODO: Validate if a user exists in our database
    loading.value = true;
    const { data: userWithUsernameAlreadyExits } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();
    if (userWithUsernameAlreadyExits) {
      loading.value = false;
      return (errorMessage.value = "User already registered");
    }
    errorMessage.value = "";
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }
    await supabase.from("users").insert({
      email,
      username
    });
    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();
    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    };
    loading.value = false;
  };

  //LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };
  //ALREADY LOGGED IN
  const getUser = async () => {
    loadingUser.value = true;
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      loadingUser.value = false;
      return (user.value = null);
    }
    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data.user.email)
      .single();
    user.value = {
      id: userWithEmail.id,
      email: userWithEmail.email,
      username: userWithEmail.username
    };
    loadingUser.value = false;
  };
  const clearErrorMessage = () => {
    errorMessage.value = "";
  };
  return {
    user,
    handleLogin,
    handleLogout,
    handleSignup,
    getUser,
    errorMessage,
    clearErrorMessage,
    loading,
    loadingUser
  };
});
