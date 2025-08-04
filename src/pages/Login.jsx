import {
  Button,
  TextInput,
  Paper,
  Title,
  Text,
  Container,
  PasswordInput,
  Group,
  Anchor,
  Divider,
  Modal,
} from "@mantine/core";
import classes from "../css/AuthenticationTitle.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const [showErrorModal, setShowErrorModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (values) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      (u) => u.email === values.email && u.password === values.password
    );

    if (matchedUser) {
      dispatch(login(matchedUser));
      localStorage.setItem("user", JSON.stringify(matchedUser));
      navigate("/dashboard");
    } else {
      setShowErrorModal(true);
    }
  };

  return (
    <Container
      size={520}
      my={90}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Paper shadow="md" radius="md" p="xl" withBorder w="100%">
        <Title align="center" style={{ fontWeight: 700 }}>
          Welcome
        </Title>
        <Text className={classes.subtitle}>
          Login with your own credentials
        </Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <TextInput
                label="Email"
                name="email"
                placeholder="you@example.com"
                mt="md"
                value={values.email}
                onChange={handleChange}
                error={touched.email && errors.email}
                required
              />
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Your password"
                mt="md"
                value={values.password}
                onChange={handleChange}
                error={touched.password && errors.password}
                required
              />
              <Group position="apart" mt="xs">
                <Anchor
                  size="sm"
                  component="button"
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </Anchor>
              </Group>
              <Button fullWidth mt="xl" type="submit">
                Sign in
              </Button>
              <Divider
                my="lg"
                label="Don't have an account?"
                labelPosition="center"
              />
              <Button
                fullWidth
                variant="outline"
                onClick={() => navigate("/register")}
              >
                Create account
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>

      <Modal
        opened={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Login Failed"
        centered
      >
        <Text color="red">Invalid email or password. Please try again.</Text>
        <Group position="right" mt="md">
          <Button onClick={() => setShowErrorModal(false)}>Close</Button>
        </Group>
      </Modal>
    </Container>
  );
}
