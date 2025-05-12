import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const sectors = ['IT', 'Healthcare', 'Finance'];
const domains = {
  IT: ['Software Development', 'Networking'],
  Healthcare: ['Pharmacy', 'Medical Devices'],
  Finance: ['Banking', 'Investments'],
};
const subDomains = {
  'Software Development': ['Frontend', 'Backend'],
  Networking: ['Infrastructure', 'Security'],
  Pharmacy: ['Pharmacology', 'Dispensary'],
  'Medical Devices': ['Monitoring', 'Diagnostic'],
  Banking: ['Retail', 'Corporate'],
  Investments: ['Stocks', 'Bonds'],
};


const formSchema = z.object({
  assessmentTitle: z.string().min(1, 'Assessment Title is required'),
  sector: z.string().min(1, 'Sector is required'),
  assessmentDescription: z.string().min(1, 'Description is required'),
});

const AssessmentForm = () => {
  const [sections, setSections] = useState([]);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessmentTitle: '',
      sector: '',
      assessmentDescription: '',
    },
  });

  const watchSector = watch('sector');

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        sectionTitle: '',
        domain: '',
        subDomains: [],
        totalMarks: 0,
        totalQuestions: 0,
        isTimeEnabled: false,
        timeDuration: 0,
        shuffleQuestions: false,
      },
    ]);
  };

  const removeSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;

    if (field === 'domain') {
      updatedSections[index].subDomains = [];
    }

    if (field === 'subDomains') {
      updatedSections[index].totalMarks = value.length * 10;
      updatedSections[index].totalQuestions = value.length * 5;

      if (updatedSections[index].isTimeEnabled) {
        updatedSections[index].timeDuration = value.length * 30;
      }
    }

    if (field === 'isTimeEnabled') {
      updatedSections[index].timeDuration =
        value && updatedSections[index].subDomains.length > 0
          ? updatedSections[index].subDomains.length * 30
          : 0;
    }

    setSections(updatedSections);
  };

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      sections,
    };
    console.log('Assessment Submitted:', finalData);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assessment Update
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="assessmentTitle"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Assessment Title"
                  fullWidth
                  error={!!errors.assessmentTitle}
                  helperText={errors.assessmentTitle?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="sector"
              control={control}
              render={({ field }) => (
                <Select {...field} fullWidth displayEmpty>
                  <MenuItem value="" disabled>
                    Select Sector
                  </MenuItem>
                  {sectors.map((sector) => (
                    <MenuItem key={sector} value={sector}>
                      {sector}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.sector && (
              <FormHelperText error>{errors.sector.message}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="assessmentDescription"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Assessment Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.assessmentDescription}
                  helperText={errors.assessmentDescription?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Sections</Typography>

          {sections.map((section, index) => (
            <Grid container spacing={2} key={index} sx={{ mt: 1, border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
  {/* First Row: Section Title, Domain, and SubDomains */}
  <Grid container item spacing={2} xs={12}>
    <Grid item xs={12} md={4}>
      <TextField
        label="Section Title"
        value={section.sectionTitle}
        onChange={(e) => handleSectionChange(index, 'sectionTitle', e.target.value)}
        fullWidth
      />
    </Grid>
    <Grid item xs={12} md={4}>
      <Select
        value={section.domain}
        onChange={(e) => handleSectionChange(index, 'domain', e.target.value)}
        fullWidth
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Domain
        </MenuItem>
        {domains[watchSector]?.map((d) => (
          <MenuItem key={d} value={d}>
            {d}
          </MenuItem>
        ))}
      </Select>
    </Grid>
   <Grid item xs={12} md={4}>
  <Select
    multiple
    value={section.subDomains}
    onChange={(e) => handleSectionChange(index, 'subDomains', e.target.value)}
    fullWidth
    sx={{
      width: subDomains[section.domain] && subDomains[section.domain].length > 0 ? '100%' : '5cm',
    }}
  >
    {subDomains[section.domain]?.map((sd) => (
      <MenuItem key={sd} value={sd}>
        {sd}
      </MenuItem>
    ))}
  </Select>
</Grid>

  </Grid>

  {/* Second Row: Total Marks, Total Questions, and Time Duration */}
  <Grid container item spacing={2} xs={12}>
    <Grid item xs={6} md={3}>
      <TextField
        label="Total Marks"
        value={section.totalMarks}
        fullWidth
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={6} md={3}>
      <TextField
        label="Total Questions"
        value={section.totalQuestions}
        fullWidth
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <FormControlLabel
        control={
          <Checkbox
            checked={section.isTimeEnabled}
            onChange={(e) => handleSectionChange(index, 'isTimeEnabled', e.target.checked)}
          />
        }
        label="Enable Time Duration"
      />
    </Grid>
    {section.isTimeEnabled && (
      <Grid item xs={12} md={3}>
        <TextField
          label="Time Duration (mins)"
          value={section.timeDuration}
          fullWidth
          InputProps={{ readOnly: true }}
        />
      </Grid>
    )}
  </Grid>

  {/* Third Row: Shuffle Questions and Remove Section */}
  <Grid container item spacing={2} xs={12}>
    <Grid item xs={12} md={6}>
      <FormControlLabel
        control={
          <Checkbox
            checked={section.shuffleQuestions}
            onChange={(e) => handleSectionChange(index, 'shuffleQuestions', e.target.checked)}
          />
        }
        label="Shuffle Questions"
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <Button color="error" variant="outlined" onClick={() => removeSection(index)}>
        Remove Section
      </Button>
    </Grid>
  </Grid>
</Grid>

          ))}

          <Button variant="contained" onClick={addSection} sx={{ mt: 2 }}>
            Add Section
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button type="submit" variant="contained" color="primary">
            Save Assessment
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AssessmentForm;