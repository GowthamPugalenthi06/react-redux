import React, { useEffect, useState } from "react";
import {
  Table, Button, Modal, TextInput, Group, Radio, Textarea, Text, Title,
  ScrollArea, Paper, Container, Card, Badge, ActionIcon, Tooltip, Stack,
  Box, ThemeIcon, Alert, Center, Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loadSubmissions, updateSubmission, deleteSubmission } from "../store/formSlice";
import {
  IconEdit, IconTrash, IconCheck, IconEye, IconUsers, IconAlertCircle,
  IconMail, IconPhone, IconMapPin, IconCalendar, IconUser
} from "@tabler/icons-react";

export default function FormList() {
  const dispatch = useDispatch();
  const allSubmissions = useSelector((state) => state.form.submissions);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.username.toLowerCase() === "admin";

  const submissionsToDisplay = isAdmin
    ? allSubmissions
    : allSubmissions.filter(
        (entry) => entry.submittedBy === currentUser?.email
      );

  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [successOpened, { open: openSuccess, close: closeSuccess }] = useDisclosure(false);

  const [viewData, setViewData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("submissions")) || [];
    dispatch(loadSubmissions(localData));
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(allSubmissions)) {
       localStorage.setItem("submissions", JSON.stringify(allSubmissions));
    }
  }, [allSubmissions]);
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
      dispatch(updateSubmission({ id: editId, updatedData: values }));
      closeEdit();
      openSuccess();
    },
  });

  const handleView = (entry) => {
    setViewData(entry);
    openView();
  };

  const handleEdit = (entry) => {
    setEditId(entry.id);
    formik.setValues(entry); 
    openEdit();
  };

  const handleDelete = () => {
    dispatch(deleteSubmission(deleteId));
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
              <IconUsers size="20px" />
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
            {submissionsToDisplay.length}{" "}
            {submissionsToDisplay.length === 1 ? "Entry" : "Entries"}
          </Badge>
        </Group>
      </Card>

      <Card shadow="sm" padding="xl" radius="md">
        {submissionsToDisplay.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <ThemeIcon size="xl" radius="xl" variant="light" color="gray">
                <IconUsers size="32px" />
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
            >
              <Table.Thead>
                <Table.Tr>
                   <Table.Th>Name</Table.Th>
                   <Table.Th>Birth Date</Table.Th>
                   <Table.Th>Gender</Table.Th>
                   <Table.Th>Phone</Table.Th>
                   <Table.Th>Email</Table.Th>
                   <Table.Th>Address</Table.Th>
                  {isAdmin && <Table.Th>User</Table.Th>}
                  <Table.Th ta="center">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {submissionsToDisplay.map((entry) => (
                  <Table.Tr key={entry.id}>
                      <Table.Td>{`${entry.firstName} ${entry.lastName}`}</Table.Td>
                      <Table.Td>{formatDate(entry.birthDate)}</Table.Td>
                      <Table.Td>{getGenderBadge(entry.gender)}</Table.Td>
                      <Table.Td>{entry.phone}</Table.Td>
                      <Table.Td>{entry.email}</Table.Td>
                      <Table.Td>
                        <Text size="sm" lineClamp={2} maw={200}>{entry.address}</Text>
                      </Table.Td>
                    {isAdmin && <Table.Td>{entry.submittedBy}</Table.Td>}
                      <Table.Td>
                        <Group gap="xs" justify="center">
                          <Tooltip label="Edit submission">
                            <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(entry)}>
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="View submission">
                           <ActionIcon variant="subtle" color="teal" onClick={() => handleView(entry)}>
                             <IconEye size={16} />
                           </ActionIcon>
                        </Tooltip>
                          <Tooltip label="Delete submission">
                            <ActionIcon variant="subtle" color="red" onClick={() => { setDeleteId(entry.id); openDelete(); }}>
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

      <Modal opened={viewOpened} onClose={closeView} title="View Submission" size="lg" centered padding="xl">
        {viewData && (
          <Stack gap="lg">
            <Group grow>
              <Box>
                <Group gap="xs" mb="xs">
                  <ThemeIcon size="sm" variant="light" color="blue">
                    <IconUser size="12.8px" />
                  </ThemeIcon>
                  <Text size="sm" fw={500} c="dimmed">Name</Text>
                </Group>
                <Text fw={500}>
                  {viewData.firstName} {viewData.middleInitial && `${viewData.middleInitial}. `}{viewData.lastName}
                </Text>
              </Box>
              <Box>
                <Group gap="xs" mb="xs">
                  <ThemeIcon size="sm" variant="light" color="green">
                    <IconCalendar size="12.8px" />
                  </ThemeIcon>
                  <Text size="sm" fw={500} c="dimmed">Birth Date</Text>
                </Group>
                <Text>{formatDate(viewData.birthDate)}</Text>
              </Box>
            </Group>

            <Divider />

            <Group grow>
              <Box>
                <Text size="sm" fw={500} c="dimmed" mb="xs">Gender</Text>
                {getGenderBadge(viewData.gender)}
              </Box>
              <Box>
                <Group gap="xs" mb="xs">
                  <ThemeIcon size="sm" variant="light" color="orange">
                    <IconPhone size="12.8px" />
                  </ThemeIcon>
                  <Text size="sm" fw={500} c="dimmed">Phone</Text>
                </Group>
                <Text>{viewData.phone}</Text>
              </Box>
            </Group>

            <Divider />

            <Box>
              <Group gap="xs" mb="xs">
                <ThemeIcon size="sm" variant="light" color="red">
                  <IconMail size="12.8px" />
                </ThemeIcon>
                <Text size="sm" fw={500} c="dimmed">Email</Text>
              </Group>
              <Text>{viewData.email}</Text>
            </Box>

            <Box>
              <Group gap="xs" mb="xs">
                <ThemeIcon size="sm" variant="light" color="teal">
                  <IconMapPin size="12.8px" />
                </ThemeIcon>
                <Text size="sm" fw={500} c="dimmed">Address</Text>
              </Group>
              <Text>{viewData.address}</Text>
            </Box>

            {isAdmin && (
              <>
                <Divider />
                <Box>
                  <Text size="sm" fw={500} c="dimmed" mb="xs">Submitted By</Text>
                  <Text>{viewData.submittedBy}</Text>
                </Box>
              </>
            )}

            <Group justify="flex-end" mt="lg">
              <Button variant="default" onClick={closeView}>Close</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      <Modal opened={editOpened} onClose={closeEdit} title="Edit Submission" size="lg" centered padding="xl">
        <form onSubmit={formik.handleSubmit}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                {...formik.getFieldProps("firstName")}
                error={formik.touched.firstName && formik.errors.firstName}
              />
              <TextInput
                label="M.I."
                placeholder="M"
                {...formik.getFieldProps("middleInitial")}
                error={formik.touched.middleInitial && formik.errors.middleInitial}
                maxLength={1}
              />
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                {...formik.getFieldProps("lastName")}
                error={formik.touched.lastName && formik.errors.lastName}
              />
            </Group>
            <TextInput
              label="Birth Date"
              type="date"
              {...formik.getFieldProps("birthDate")}
              error={formik.touched.birthDate && formik.errors.birthDate}
            />
            <Radio.Group
              label="Gender"
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
            <TextInput
              label="Phone Number"
              type="number"
              placeholder="1234567890"
              {...formik.getFieldProps("phone")}
              error={formik.touched.phone && formik.errors.phone}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="user@example.com"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && formik.errors.email}
            />
            <Textarea
              label="Address"
              placeholder="Enter full address"
              autosize
              minRows={3}
              {...formik.getFieldProps("address")}
              error={formik.touched.address && formik.errors.address}
            />
            <Group justify="flex-end" mt="lg">
              <Button variant="default" onClick={closeEdit}>Cancel</Button>
              <Button type="submit">Update Submission</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Submission" centered>
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size="16px" />} color="red">
            Are you sure you want to delete this submission? This action cannot be undone.
          </Alert>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDelete}>Cancel</Button>
            <Button color="red" onClick={handleDelete}>Delete</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={successOpened} onClose={closeSuccess} title="Success" centered>
        <Stack gap="md" align="center">
          <ThemeIcon size="xl" color="green" variant="light">
            <IconCheck size="20px" />
          </ThemeIcon>
          <Text ta="center">Operation completed successfully!</Text>
          <Button onClick={closeSuccess}>OK</Button>
        </Stack>
      </Modal>

    </Container>
  );
}