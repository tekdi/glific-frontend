import Button from '@mui/material/Button';
import UploadIcon from 'assets/images/icons/UploadIcon.svg?react';
import styles from './UploadFile.module.css';
import { slicedString } from 'common/utils';
import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Dropdown } from '../Form/Dropdown/Dropdown';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from 'graphql/queries/KnowledgeBase';
import { CircularProgress } from '@mui/material';

interface UploadFileProps {
  setFile: any;
  category: string | null;
  setCategory: any;
}

export const UploadFile = ({ setFile, category, setCategory }: UploadFileProps) => {
  const [errors, setErrors] = useState<string>('');
  const [fileName, setFileName] = useState<null | string>(null);
  const [options, setOptions] = useState([]);

  const { loading } = useQuery(GET_CATEGORIES, {
    onCompleted: (data) => {
      setOptions(
        data.categories.map((category: any) => ({ id: category.id, label: category.name }))
      );
    },
  });

  let formFieldItems: any = [
    {
      component: Dropdown,
      options,
      name: 'category',
      placeholder: 'Select Category',
      fieldValue: category,
      fieldChange: (event: any) => {
        setCategory(event?.target.value);
        setErrors('');
      },
    },
  ];

  const addAttachment = (event: any) => {
    const media = event.target.files[0];
    if (media) {
      if (media.size / 1000000 > 10) {
        setErrors('File size should be less than 10MB');
        return;
      } else if (media.type !== 'application/pdf') {
        setErrors('File type should be PDF');
        return;
      }

      const mediaName = media.name;
      const slicedName = slicedString(mediaName, 25);
      setFileName(slicedName);
      setFile(media);
    }
  };

  if (loading) {
    return <CircularProgress className={styles.Loading} />;
  }

  return (
    <Formik
      initialValues={{
        files: '',
      }}
      onSubmit={() => {}}
    >
      <Form className={styles.Form} data-testid="formLayout" encType="multipart/form-data">
        <div className={styles.DialogContent} data-testid="">
          {formFieldItems.map((field: any) => (
            <div className={styles.AttachmentFieldWrapper} key={field.name}>
              <Field {...field} key={field.name} validateURL={errors} />
            </div>
          ))}
          <div className={styles.FormError}>{errors}</div>
        </div>

        <div className={styles.FormField}>Document</div>
        <Button
          className="Container"
          fullWidth={true}
          component="label"
          role={undefined}
          variant="text"
          tabIndex={-1}
        >
          <div className={styles.Container}>
            {fileName !== null ? (
              <span className={styles.FileName}>{fileName}</span>
            ) : (
              <div>
                <UploadIcon className={styles.UploadIcon} />
                <span>Upload File</span>
              </div>
            )}
            <input
              type="file"
              id="uploadFile"
              accept=".pdf"
              data-testid="uploadFile"
              name="file"
              onChange={(event) => {
                addAttachment(event);
              }}
            />
          </div>
        </Button>
        <p className={styles.HelperText}>Upload PDF files less than 10 MB.</p>
        <p className={styles.FormError}> {errors}</p>
      </Form>
    </Formik>
  );
};
