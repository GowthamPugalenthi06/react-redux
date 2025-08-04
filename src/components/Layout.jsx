import React, { useState, useEffect } from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Burger,
  Button,
  Group,
  Stack,
  Text,
  Box,
  Divider,
  Avatar,
  Paper,
  useMantineTheme,
  UnstyledButton,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconUser,
  IconFileText,
  IconClipboardList,
  IconLogout,
  IconChevronRight,
  IconHome,
} from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

const NavigationItem = ({ icon: Icon, label, onClick, active = false }) => {
  const theme = useMantineTheme();
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '10px 14px',
        borderRadius: theme.radius.md,
        backgroundColor: active ? theme.colors.blue[0] : 'transparent',
        color: active ? theme.colors.blue[7] : theme.colors.gray[7],
        fontWeight: active ? 600 : 400,
        transition: 'all 150ms ease',
      }}
    >
      <ThemeIcon variant={active ? 'light' : 'subtle'} color={active ? 'blue' : 'gray'} size={32} radius="md" mr="md">
        <Icon size={18} />
      </ThemeIcon>
      <Text size="sm" style={{ flex: 1 }}>{label}</Text>
      {active && <IconChevronRight size={16} />}
    </UnstyledButton>
  );
};

export default function Layout() {
  const dispatch = useDispatch();
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
 

  const [activeNav, setActiveNav] = useState('');
  
  useEffect(() => {
    if (location.pathname.includes('profile')) setActiveNav('profile');
    else if (location.pathname.includes('form-list')) setActiveNav('form-list');
    else if (location.pathname.includes('form')) setActiveNav('form');
    else setActiveNav('');
    
  }, [location.pathname]);


  
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      style={{ backgroundColor: theme.colors.gray[0] }}
    >
      
      <AppShellHeader
        style={{
          backgroundColor: 'white',
          borderBottom: `1px solid ${theme.colors.gray[2]}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Group h="100%" px="xl" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
            <Group gap="xs">
              <ThemeIcon size={40} radius="md" variant="gradient">
                <IconHome size={22} />
              </ThemeIcon>
              <Box>
                <Text fw={700} size="lg" c="dark">Dashboard </Text>
                <Text size="xs" c="dimmed">Management System</Text>
              </Box>
            </Group>
          </Group>

          <Group gap="md">
          
            <Paper p="xs" radius="md" style={{ backgroundColor: theme.colors.gray[0] }}>
              <Group gap="sm">
                <Avatar src={user?.avatar} size={32} radius="md" color="blue" variant="light">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box visibleFrom="sm">
                  <Text size="sm" fw={600}>{user?.username || 'User'}</Text>
                  
                </Box>
              </Group>
            </Paper>
          </Group>
        </Group>
      </AppShellHeader>

      <AppShellNavbar p="lg" style={{ backgroundColor: 'white', borderRight: `1px solid ${theme.colors.gray[2]}` }}>
        <Stack justify="space-between" h="100%">
         
          <Box>
            

            <Stack gap="xs">
              <NavigationItem icon={IconUser} label="Profile" onClick={() => navigate('profile')} active={activeNav === 'profile'} />
              <NavigationItem icon={IconFileText} label="Form Submission" onClick={() => navigate('form')} active={activeNav === 'form'} />
              <NavigationItem icon={IconClipboardList} label="Submitted Forms" onClick={() => navigate('form-list')} active={activeNav === 'form-list'} />
            </Stack>
          </Box>

         
          <Box>
            <Divider my="md" label="Account" labelPosition="center" />
            <Paper p="sm" radius="md" shadow="xs" style={{ backgroundColor: theme.colors.gray[0] }}>
              <Group gap="sm">
                <Avatar size={36} radius="md" color="blue" variant="light">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Text size="sm" fw={500}>{user?.username || 'User'}</Text>
                  <Text size="xs" c="dimmed">{user?.email || 'user@example.com'}</Text>
                </Box>
              </Group>
            </Paper>

            <Button
              fullWidth
              leftSection={<IconLogout size={18} />}
              color="red"
              variant="light"
              mt="md"
              radius="md"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Stack>
      </AppShellNavbar>

      <AppShellMain
        style={{
          backgroundColor: theme.colors.gray[0],
          minHeight: 'calc(100vh - 70px)',
        }}
      >
        <Outlet />
      </AppShellMain>
    </AppShell>
  );
}
