import {
  Button,
  TextInput,
  Paper,
  Title,
  Text,
  Container,
  PasswordInput,
  Divider,
} from "@mantine/core";
import classes from "../css/AuthenticationTitle.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../store/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      phone_number:"",
      location:""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
      .required('Phone number is required'),
      phone_number: Yup.string()
        .required('Phone number is required')
      .matches(/^[0-9]+$/, 'Phone number must be digits only')
      .min(10, 'Phone must be at least 10 digits')
      .max(10, 'Phone must be at most 10 digits'),
       location: Yup.string()
       
        .required("Location is required"),
      
      
    }),
    onSubmit: (values) => {
      dispatch(register(values));
      navigate("/login");
    },
  });

  return (
    <Container
      size={520}
      my={90}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Paper shadow="md" radius="md" p="xl" withBorder w="100%">
        <Title align="center" style={{ fontWeight: 700 }}>
          Create an Account
        </Title>
        <Text className={classes.subtitle}>
          Register with your personal details
        </Text>

        <form onSubmit={formik.handleSubmit}>
          <TextInput
            label="Username"
            placeholder="yourusername"
            mt="md"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && formik.errors.username}
          />

          <TextInput
            label="Email"
            placeholder="you@example.com"
            mt="md"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
          />
          <TextInput
            label="Phone Number"
            placeholder="Your Phone Number"
            mt="md"
            name="phone_number"
            type="number"
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone_number && formik.errors.phone_number}
          />

          <TextInput
            label="Location"
            placeholder="Your Location"
            mt="md"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && formik.errors.location}
          />

          <Button fullWidth mt="xl" type="submit">
            Register
          </Button>
        </form>

        <Divider
          my="lg"
          label="Already have an account?"
          labelPosition="center"
        />

        <Button fullWidth variant="outline" onClick={() => navigate("/login")}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
