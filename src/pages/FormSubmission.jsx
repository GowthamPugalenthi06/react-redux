import {
  Text,
  Button,
  Group,
  Radio,
  Stack,
  TextInput,
  Textarea,
  Modal,
  Notification,
  Paper,
  Title,
  Divider,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { addSubmission, loadSubmissions } from '../store/formSlice';
import { IconCheck } from '@tabler/icons-react';

export default function FormPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    middleInitial: Yup.string().max(1, 'Only one character allowed'),
    lastName: Yup.string().required('Last name is required'),
    birthDate: Yup.date().required('Birth date is required'),
    gender: Yup.string().required('Gender is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]+$/, 'Phone number must be digits only')
      .min(10, 'Phone must be at least 10 digits')
      .max(10, 'Phone must be at most 10 digits'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    address: Yup.string().required('Address is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      middleInitial: '',
      lastName: '',
      birthDate: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
    },
    validationSchema,
   onSubmit: (values, { resetForm }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  if (!currentUser?.email) {
    alert('User not logged in. Please login to submit.');
    return;
  }

  const submissionWithUser = {
    ...values,
    submittedBy: currentUser.email,
    submittedAt: new Date().toISOString(), 
  };

  const existing = JSON.parse(localStorage.getItem('submissions')) || [];
  const updated = [...existing, submissionWithUser];
  localStorage.setItem('submissions', JSON.stringify(updated));

  dispatch(addSubmission(submissionWithUser));
  open();
  resetForm();
}

  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('submissions')) || [];
    dispatch(loadSubmissions(stored));
  }, [dispatch]);

  return (
    <>
      <Box maw={700} mx="auto">
        <Title order={2} ta="center" mt="xl" mb="md">
          Submit Your Details
        </Title>

        <Paper withBorder shadow="sm" p="xl" radius="md">
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing="md">

              <Group grow>
                <TextInput
                  label="First Name"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && formik.errors.firstName}
                />
                <TextInput
                  label="M.I."
                  name="middleInitial"
                  value={formik.values.middleInitial}
                  onChange={formik.handleChange}
                  error={formik.touched.middleInitial && formik.errors.middleInitial}
                  maxLength={1}
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && formik.errors.lastName}
                />
              </Group>

              <TextInput
                label="Birth Date"
                name="birthDate"
                type="date"
                value={formik.values.birthDate}
                onChange={formik.handleChange}
                error={formik.touched.birthDate && formik.errors.birthDate}
              />

              <Radio.Group
                name="gender"
                label="Gender"
                value={formik.values.gender}
                onChange={(value) => formik.setFieldValue('gender', value)}
                error={formik.touched.gender && formik.errors.gender}
              >
                <Group mt="xs">
                  <Radio value="Male" label="Male" />
                  <Radio value="Female" label="Female" />
                  <Radio value="Decline to Answer" label="Prefer not to say" />
                </Group>
              </Radio.Group>

              <Divider my="xs" label="Contact Info" labelPosition="center" />

              <TextInput
                label="Phone Number"
                name="phone"
                type="number"
                placeholder="e.g., 9876543210"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && formik.errors.phone}
              />
              <TextInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
              />

              <Textarea
                label="Address"
                name="address"
                placeholder="Your full address"
                autosize
                minRows={3}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && formik.errors.address}
              />

              <Button type="submit" fullWidth radius="md" mt="md">
                Submit Form
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>

      <Modal
        opened={opened}
        onClose={close}
        centered
        title="Submission Successful"
        radius="md"
        transitionProps={{ transition: 'pop', duration: 200 }}
      >
        <Notification
          icon={<IconCheck size="1.2rem" />}
          color="teal"
          title="Success"
          withCloseButton={false}
        >
          Your form has been successfully submitted.
        </Notification>
      </Modal>
    </>
  );
}
