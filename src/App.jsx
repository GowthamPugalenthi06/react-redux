import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormHelperText,
  Card,
  CardContent,
  Grid,
  Container
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  gender: Yup.string()
    .required('Gender is required'),
  country: Yup.string()
    .required('Country is required'),
  termsAccepted: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' }
];

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  country: '',
  termsAccepted: false
};

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (values) => {
    
    console.log('Form Data:', JSON.stringify(values, null, 2));
    
   
    setSubmittedData(values);
    
    
  };

  const handleReset = (resetForm) => {
    resetForm();
    setSubmittedData(null);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          User Registration
        </Typography>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, resetForm }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="fullName"
                    label="Full Name"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                    variant="outlined"
                  />
                </Grid>

               
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    variant="outlined"
                  />
                </Grid>

             
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    variant="outlined"
                   
                  />
                </Grid>

               
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    variant="outlined"
                    
                  />
                </Grid>

                
                  <FormControl error={touched.gender && Boolean(errors.gender)}>
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                      <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                    {touched.gender && errors.gender && (
                      <FormHelperText>{errors.gender}</FormHelperText>
                    )}
                  </FormControl>
                

                
                  <FormControl fullWidth error={touched.country && Boolean(errors.country)}>
                    <InputLabel>Country</InputLabel>
                    <Select
                      name="country"
                      value={values.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Country"
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.value} value={country.value}>
                          {country.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.country && errors.country && (
                      <FormHelperText>{errors.country}</FormHelperText>
                    )}
                  </FormControl>
                

                
                <Grid item xs={12}>
                  <FormControl error={touched.termsAccepted && Boolean(errors.termsAccepted)}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="termsAccepted"
                          checked={values.termsAccepted}
                          onChange={handleChange}
                        />
                      }
                      label="I accept the terms and conditions"
                    />
                    {touched.termsAccepted && errors.termsAccepted && (
                      <FormHelperText>{errors.termsAccepted}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

              
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      size="large"
                    >
                      {isSubmitting ? 'Submitting...' : 'Register'}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleReset(resetForm)}
                      size="large"
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>

      {/* Display Submitted Data */}
      {submittedData && (
        <Card elevation={3} sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              Registration Successful!
            </Typography>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Submitted Data:
            </Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {submittedData.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {submittedData.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Gender:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {submittedData.gender.charAt(0).toUpperCase() + submittedData.gender.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Country:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {countries.find(c => c.value === submittedData.country)?.label}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Terms Accepted:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="success.main">
                    ✓ Yes
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}