import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  TextInput,
  Group,
  Radio,
  Textarea,
  Text,
  Title,
  ScrollArea,
  Paper,
  Notification,
  Divider,
  Container,
  Card,
  Badge,
  ActionIcon,
  Tooltip,
  Stack,
  Box,
  ThemeIcon,
  Alert,
  Center,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubmission,
  loadSubmissions,
  updateSubmission,
  deleteSubmission,
} from "../store/formSlice";
import {
  IconEdit,
  IconTrash,
  IconCheck,
  IconEye,
  IconUsers,
  IconAlertCircle,
  IconX,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconUser,
} from "@tabler/icons-react";

export default function FormList() {
  const dispatch = useDispatch();
  const allSubmissions = useSelector((state) => state.form.submissions);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.username.toLowerCase() === "admin";
  const submissions = isAdmin
    ? allSubmissions 
    : allSubmissions.filter(
        (entry) => entry.submittedBy === currentUser?.email
      );

  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [viewData, setViewData] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [successOpened, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("submissions")) || [];
    dispatch(loadSubmissions(localData));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("submissions", JSON.stringify(submissions));
  }, [submissions]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleInitial: "",
      lastName: "",
      birthDate: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      middleInitial: Yup.string().max(1, "Max 1 character"),
      lastName: Yup.string().required("Required"),
      birthDate: Yup.string().required("Required"),
      gender: Yup.string().required("Required"),
      phone: Yup.string()
        .required("Required")
        .matches(/^[0-9]+$/, "Digits only")
        .min(10, "10 digits required")
        .max(10, "Max 10 digits"),
      email: Yup.string().email("Invalid email").required("Required"),
      address: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      dispatch(updateSubmission({ id: editId, updated: values }));
      setLoading(false);
      closeEdit();
      openSuccess();
    },
  });
  const handleView = (entry) => {
    setViewData(entry);
    openView();
  };

  const handleEdit = (entry, id) => {
    setEditId(id);
    formik.setValues(entry);
    openEdit();
  };

  const handleDelete = () => {
    dispatch(deleteSubmission(deleteId));
    setLoading(false);
    closeDelete();
    openSuccess();
  };

  const getGenderBadge = (gender) => {
    const colors = {
      Male: "blue",
      Female: "pink",
      "Decline to Answer": "gray",
    };
    return (
      <Badge variant="light" color={colors[gender] || "gray"} size="sm">
        {gender}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container size="xl" py="xl">
      <Card shadow="sm" padding="xl" radius="md" mb="xl">
        <Group justify="space-between" align="center">
          <Group>
            <ThemeIcon size="xl" radius="md" variant="light">
              <IconUsers size="1.5rem" />
            </ThemeIcon>
            <Box>
              <Title order={2} c="dark">
                Submitted Forms
              </Title>
              <Text c="dimmed" size="sm">
                Manage and view all submitted forms
              </Text>
            </Box>
          </Group>
          <Badge size="lg" variant="light" color="blue">
            {submissions.length}{" "}
            {submissions.length === 1 ? "Entry" : "Entries"}
          </Badge>
        </Group>
      </Card>

      <Card shadow="sm" padding="xl" radius="md">
        {submissions.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <ThemeIcon size="xl" radius="xl" variant="light" color="gray">
                <IconUsers size="2rem" />
              </ThemeIcon>
              <Box ta="center">
                <Text size="lg" fw={500} c="dark">
                  No submissions yet
                </Text>
                <Text c="dimmed" size="sm">
                  Form submissions will appear here once users start submitting
                  data
                </Text>
              </Box>
            </Stack>
          </Center>
        ) : (
          <ScrollArea>
            <Table
              striped
              highlightOnHover
              withTableBorder
              withColumnBorders
              style={{ borderRadius: "8px" }}
            >
              <Table.Thead>
                <Table.Tr style={{ background: "var(--mantine-color-gray-0)" }}>
                  <Table.Th>
                    <Group gap="xs">
                      <IconUser size={16} />
                      <Text fw={600}>Name</Text>
                    </Group>
                  </Table.Th>
                  <Table.Th>
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text fw={600}>Birth Date</Text>
                    </Group>
                  </Table.Th>
                  <Table.Th>
                    <Text fw={600}>Gender</Text>
                  </Table.Th>
                  <Table.Th>
                    <Group gap="xs">
                      <IconPhone size={16} />
                      <Text fw={600}>Phone</Text>
                    </Group>
                  </Table.Th>
                  <Table.Th>
                    <Group gap="xs">
                      <IconMail size={16} />
                      <Text fw={600}>Email</Text>
                    </Group>
                  </Table.Th>
                  <Table.Th>
                    <Group gap="xs">
                      <IconMapPin size={16} />
                      <Text fw={600}>Address</Text>
                    </Group>
                  </Table.Th>
                  {submissions.username == 'admin' ? <Table.Th>
  <Group gap="xs">
    <IconUser size={16} />
    <Text fw={600}>User</Text>
  </Group>
</Table.Th> : null}
                  <Table.Th ta="center">
                    <Text fw={600}>Actions</Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {submissions.map((entry, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Group gap="xs">
                        <Text fw={500}>{entry.firstName}</Text>
                        {entry.middleInitial && (
                          <Text c="dimmed" size="sm">
                            {entry.middleInitial}.
                          </Text>
                        )}
                        <Text fw={500}>{entry.lastName}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{formatDate(entry.birthDate)}</Text>
                    </Table.Td>
                    <Table.Td>{getGenderBadge(entry.gender)}</Table.Td>
                    <Table.Td>
                      <Text size="sm" ff="monospace">
                        {entry.phone}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="sm"
                        c="blue"
                        style={{ textDecoration: "none" }}
                      >
                        {entry.email}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2} maw={200}>
                        {entry.address}
                      </Text>
                    </Table.Td>
                    {submissions.username == 'admin' ? <Table.Td>
  <Group gap="xs">
    <Text size="sm">{entry.submittedBy}</Text>
    <Badge color={entry.submittedBy === 'admin@mail.com' ? 'red' : 'blue'} variant="light">
      {entry.submittedBy === 'admin@mail.com' ? 'Admin' : 'Member'}
    </Badge>
  </Group>
</Table.Td>
 : null}
                    <Table.Td>
                      <Group gap="xs" justify="center">
                        <Tooltip label="Edit submission">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => handleEdit(entry, index)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="View submission">
                          <ActionIcon
                            variant="subtle"
                            color="teal"
                            onClick={() => handleView(entry)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Delete submission">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => {
                              setDeleteId(index);
                              openDelete();
                            }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Card>

      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title={
          <Group>
            <ThemeIcon variant="light" color="blue">
              <IconEdit size="1rem" />
            </ThemeIcon>
            <Text fw={600}>Edit Submission</Text>
          </Group>
        }
        size="lg"
        centered
        padding="xl"
      >
        <form onSubmit={formik.handleSubmit}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                {...formik.getFieldProps("firstName")}
                error={formik.touched.firstName && formik.errors.firstName}
                leftSection={<IconUser size={16} />}
              />
              <TextInput
                label="M.I."
                placeholder="M"
                {...formik.getFieldProps("middleInitial")}
                error={
                  formik.touched.middleInitial && formik.errors.middleInitial
                }
                maxLength={1}
                style={{ flexBasis: "100px" }}
              />
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                {...formik.getFieldProps("lastName")}
                error={formik.touched.lastName && formik.errors.lastName}
                leftSection={<IconUser size={16} />}
              />
            </Group>

            <TextInput
              label="Birth Date"
              type="date"
              {...formik.getFieldProps("birthDate")}
              error={formik.touched.birthDate && formik.errors.birthDate}
              leftSection={<IconCalendar size={16} />}
            />

            <Box>
              <Text size="sm" fw={500} mb="xs">
                Gender
              </Text>
              <Radio.Group
                value={formik.values.gender}
                onChange={(value) => formik.setFieldValue("gender", value)}
                error={formik.touched.gender && formik.errors.gender}
              >
                <Group>
                  <Radio value="Male" label="Male" />
                  <Radio value="Female" label="Female" />
                  <Radio value="Decline to Answer" label="Prefer not to say" />
                </Group>
              </Radio.Group>
            </Box>

            <TextInput
              label="Phone Number"
              type="tel"
              placeholder="1234567890"
              {...formik.getFieldProps("phone")}
              error={formik.touched.phone && formik.errors.phone}
              leftSection={<IconPhone size={16} />}
            />

            <TextInput
              label="Email"
              type="email"
              placeholder="user@example.com"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && formik.errors.email}
              leftSection={<IconMail size={16} />}
            />

            <Textarea
              label="Address"
              placeholder="Enter full address"
              autosize
              minRows={3}
              {...formik.getFieldProps("address")}
              error={formik.touched.address && formik.errors.address}
              leftSection={<IconMapPin size={16} />}
            />

            <Group justify="flex-end" mt="lg">
              <Button variant="default" onClick={closeEdit}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Update Submission
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <Modal
        opened={viewOpened}
        onClose={closeView}
        title={
          <Group>
            <ThemeIcon variant="light" color="teal">
              <IconEye size="1rem" />
            </ThemeIcon>
            <Text fw={600}>View Submission</Text>
          </Group>
        }
        size="lg"
        centered
        padding="xl"
      >
        {viewData && (
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="First Name"
                value={viewData.firstName}
                readOnly
              />
              <TextInput label="M.I." value={viewData.middleInitial} readOnly />
              <TextInput label="Last Name" value={viewData.lastName} readOnly />
            </Group>
            <TextInput
              label="Birth Date"
              value={formatDate(viewData.birthDate)}
              readOnly
            />
            <TextInput label="Gender" value={viewData.gender} readOnly />
            <TextInput label="Phone" value={viewData.phone} readOnly />
            <TextInput label="Email" value={viewData.email} readOnly />
            <Textarea
              label="Address"
              value={viewData.address}
              readOnly
              minRows={3}
            />
          </Stack>
        )}
      </Modal>

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title={
          <Group>
            <ThemeIcon variant="light" color="red">
              <IconAlertCircle size="1rem" />
            </ThemeIcon>
            <Text fw={600}>Confirm Deletion</Text>
          </Group>
        }
        centered
        padding="xl"
      >
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          color="red"
          variant="light"
          mb="md"
        >
          <Text>
            Are you sure you want to delete this submission? This action cannot
            be undone.
          </Text>
        </Alert>

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete} loading={loading}>
            Delete Submission
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={successOpened}
        onClose={closeSuccess}
        withCloseButton={false}
        centered
        padding="xl"
      >
        <Stack align="center" gap="md">
          <ThemeIcon size="xl" radius="xl" color="green" variant="light">
            <IconCheck size="1.5rem" />
          </ThemeIcon>
          <Box ta="center">
            <Text fw={600} size="lg">
              Success!
            </Text>
            <Text c="dimmed" size="sm">
              Your operation has been completed successfully.
            </Text>
          </Box>
          <Button onClick={closeSuccess} mt="md">
            Close
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
