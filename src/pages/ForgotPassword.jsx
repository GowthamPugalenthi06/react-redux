import { IconArrowLeft } from "@tabler/icons-react";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  PasswordInput,
  TextInput,
  Title,
  Modal,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { forgot } from "../store/authSlice";
import classes from "../css/ForgotPassword.module.css";

export default function ForgotPassword() {
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string().required("New password is required"),
    }),
    onSubmit: (values) => {
      const { email, oldPassword, newPassword } = values;
      const users = JSON.parse(localStorage.getItem("users")) || [];
      let updated = false;

      const updatedUsers = users.map((user) => {
        if (user.email === email && user.password === oldPassword) {
          const updatedUser = { ...user, password: newPassword };
          const currentUser = JSON.parse(localStorage.getItem("user"));
          if (currentUser?.email === user.email) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
            dispatch(forgot(updatedUser));
          }
          updated = true;
          return updatedUser;
        }
        return user;
      });

      if (!updated) {
        setErrorModal(true);
      } else {
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setSuccessModal(true);
      }
    },
  });

  return (
    <>
      <Modal opened={successModal} onClose={() => navigate("/login")} title="Success" centered>
        <Text>Your password has been changed successfully!</Text>
        <Button fullWidth mt="md" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Modal>

      <Modal opened={errorModal} onClose={() => setErrorModal(false)} title="Error" centered>
        <Text color="red">Invalid email or old password</Text>
        <Button fullWidth mt="md" color="red" onClick={() => setErrorModal(false)}>
          Try Again
        </Button>
      </Modal>

      <Container size={520} my={90}>
        <Title className={classes.title} ta="center">
          Forgot your password?
        </Title>
        <Text c="dimmed" fz="sm" ta="center" mt={9}>
          Enter your email, old password, and new password
        </Text>

        <Paper withBorder shadow="md" p={30} radius="md" mt="xl" component="form" onSubmit={formik.handleSubmit}>
          <TextInput
            label="Your Email"
            placeholder="your@email.com"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && formik.errors.email}
            onBlur={formik.handleBlur}
          />

          <PasswordInput
            label="Old Password"
            placeholder="Enter old password"
            name="oldPassword"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            error={formik.touched.oldPassword && formik.errors.oldPassword}
            onBlur={formik.handleBlur}
            mt="md"
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={formik.touched.newPassword && formik.errors.newPassword}
            onBlur={formik.handleBlur}
            mt="md"
          />

          <Group justify="space-between" mt="lg" className={classes.controls}>
            <Anchor c="dimmed" size="sm" className={classes.control}>
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5} onClick={() => navigate("/login")}>
                  Back to the login page
                </Box>
              </Center>
            </Anchor>
            <Button type="submit" className={classes.control}>
              Reset password
            </Button>
          </Group>
        </Paper>
      </Container>
    </>
  );
}
