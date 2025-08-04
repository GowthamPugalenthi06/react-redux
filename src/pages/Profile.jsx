import {
  Avatar,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Modal,
  TextInput,
  Divider,
  Box,
  Container,
  ThemeIcon,
  Paper,
  Badge,
  ActionIcon,
  Tooltip,
  Center,
  SimpleGrid,
} from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { updateUser } from '../store/authSlice';
import {
  IconUser,
  IconMail,
  IconEdit,
  IconCamera,
  IconCheck,
  IconUserCircle,
  IconMapPin,
  IconPhone,
  IconLocation,
} from '@tabler/icons-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';


export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [opened, { open, close }] = useDisclosure(false);
  const [successOpened, { open: openSuccess, close: closeSuccess }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    location: user?.location || '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);

    const updatedUser = {
      ...user,
      ...formData,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch(updateUser(updatedUser));

    setLoading(false);
    close();
    openSuccess();
  };

  const getInitials = (name) => {
    return name?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Container size="md" py="xl">
      <Card shadow="lg" padding="xl" radius="xl" withBorder>
        <Group justify="flex-end" p="md">
          <Tooltip label="Edit Profile">
            <ActionIcon
              variant="white"
              size="lg"
              radius="xl"
              onClick={open}
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              <IconEdit size="15px" />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Center mb="xl">
          <Box pos="relative">
            <Avatar
              size={120}
              radius="xl"
              src={null}
              alt={user?.username || 'User'}
              style={{
                border: '4px solid white',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                background: '#f1f1f1',
                color: 'white',
                fontSize: 32,
                fontWeight: 600,
              }}
            >
              {getInitials(user?.username)}
            </Avatar>

            
          </Box>
        </Center>

        <Center mb="xl">
          <Stack align="center" gap="xs">
            <Group>
              <Title order={2}>{user?.username || 'No Name'}</Title>
              <Badge variant="light" color="green" size="sm">
                Active
              </Badge>
            </Group>
            <Text size="lg" c="dimmed">
              {user?.email || 'No Email'}
            </Text>
          </Stack>
        </Center>

        <Divider my="xl" />

        <Stack gap="lg">
          <Title order={4} c="dark" mb="md">
            Profile Information
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {[
              { icon: <IconUser size="17" />, label: 'Username', value: user?.username, color: 'blue' },
              { icon: <IconMail size="17" />, label: 'Email Address', value: user?.email, color: 'teal' },
              { icon: <IconPhone size="17" />, label: 'Phone Number', value: user?.phone_number, color: 'orange' },
              { icon: <IconMapPin size="17" />, label: 'Location', value: user?.location, color: 'grape' },
            ].map((item, index) => (
              <Paper key={index} p="lg" radius="md" withBorder>
                <Group>
                  <ThemeIcon variant="light" size="lg" radius="md" color={item.color}>
                    {item.icon}
                  </ThemeIcon>
                  <Box flex={1}>
                    <Text size="sm" c="dimmed" fw={500}>
                      {item.label}
                    </Text>
                    <Text fw={600} c={item.value ? 'black' : 'dimmed'}>
                      {item.value || 'Not provided'}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>

      
      </Card>

      <Modal
  opened={opened}
  onClose={close}
  title={
    <Group>
      <ThemeIcon variant="light" color="indigo" size="lg">
        <IconUserCircle size="17px" />
      </ThemeIcon>
      <Box>
        <Text fw={600} size="lg">Edit Profile</Text>
        <Text size="sm" c="dimmed">Update your personal information</Text>
      </Box>
    </Group>
  }
  size="md"
  centered
  padding="xl"
  radius="lg"
>
  <Formik
    initialValues={formData}
    validationSchema={Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone_number: Yup.string()
        .matches(/^\d+$/, 'Phone number must be numeric')
        .min(10, 'Too short')
        .max(10, 'Too long'),
      location: Yup.string(),
    })}
    onSubmit={(values) => {
      setLoading(true);
      const updatedUser = { ...user, ...values };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch(updateUser(updatedUser));
      setLoading(false);
      close();
      openSuccess();
    }}
  >
    {({ values, handleChange, handleSubmit, touched, errors }) => (
      <Form onSubmit={handleSubmit}>
        <Stack gap="lg" mt="md">
          <TextInput
            label="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            error={touched.username && errors.username}
            placeholder="Enter your username"
            leftSection={<IconUser size="15" />}
            required
            radius="md"
            size="md"
          />

          <TextInput
            label="Email Address"
            name="email"
            type='email'
            value={values.email}
            onChange={handleChange}
            error={touched.email && errors.email}
            
            placeholder="Enter your email"
            leftSection={<IconMail size="15" />}
            required
            radius="md"
            size="md"
          />

          <TextInput
            label="Phone Number"
            name="phone_number"
            value={values.phone_number}
            onChange={handleChange}
            error={touched.phone_number && errors.phone_number}
            placeholder="Enter your phone number"
            leftSection={<IconPhone size="15" />}
            radius="md"
            size="md"
          />

          <TextInput
            label="Location"
            name="location"
            value={values.location}
            onChange={handleChange}
            error={touched.location && errors.location}
            placeholder="Enter your location"
            leftSection={<IconLocation size="15" />}
            radius="md"
            size="md"
          />

          <Group justify="flex-end" mt="xl" gap="md">
            <Button variant="default" onClick={close} radius="md" size="md">
              Cancel
            </Button>
            <Button
              type="submit"
              color="indigo"
              loading={loading}
              radius="md"
              size="md"
              leftSection={!loading && <IconCheck size="15" />}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Form>
    )}
  </Formik>
</Modal>


      <Modal
        opened={successOpened}
        onClose={closeSuccess}
        withCloseButton={false}
        centered
        size="sm"
        padding="xl"
        radius="lg"
      >
        <Stack align="center" gap="lg">
          <ThemeIcon size="xl" radius="xl" color="green" variant="light">
            <IconCheck size="15" />
          </ThemeIcon>
          <Box ta="center">
            <Text fw={600} size="lg" mb="xs">
              Profile Updated!
            </Text>
            <Text c="dimmed" size="sm">
              Your profile information has been successfully updated.
            </Text>
          </Box>
          <Button onClick={closeSuccess} radius="xl" size="md" fullWidth>
            Continue
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
