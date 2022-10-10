import React, { FC, useState } from 'react';
import { Radio } from 'antd';
import { useWidth } from '../../util/useWidth';
import './styles.scss';
import { InputModal, RadioButton, Button, Spinner } from '../shared';
import { downloadInvoice, downLoadSampleBudgetImport } from '../../apis/index';

interface IOwnProps {
  visible: boolean;
  onImport: (type: string, file: any) => void;
  onCancel: () => void;
}

const ImportBudget: FC<IOwnProps> = ({ visible, onCancel, onImport }) => {
  const width = useWidth();
  const [importType, setImportType] = useState('a');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState({ name: '' });

  const onFileSelected = (e: any) => {
    setFile(e.currentTarget.files[0]);
  };

  const handleCancel = () => {
    setImportType('a');
    setFile({ name: '' });
    onCancel();
  };

  return (
    <InputModal
      visible={visible}
      onCancel={handleCancel}
      title='Import Budget'
      type='confirm'
      onConfirm={async () => {
        if (!uploading) {
          if (file.name) {
            setUploading(true);
            await onImport(importType, file);
          }
          setImportType('a');
          setFile({ name: '' });
          setUploading(false);
        }
      }}
      modalWidth={550}
    >
      <Radio.Group
        className='d-flex'
        onChange={e => setImportType(e.target.value)}
        value={importType}
      >
        <RadioButton label='Actual' value='a' />
        <RadioButton label='Budgeted' value='b' className='ml-34' />
      </Radio.Group>
      {!uploading && (
        <div className='mt-20 mb-10'>
          <form style={{ display: 'grid' }}>
            <Button
              className={
                width > 460
                  ? 'mt-50 file-btn'
                  : 'mb-12 mt-12 mr-12 ml-12 file-btn'
              }
              color='blue'
              size={4}
              width={width > 460 ? 'small' : 'wide'}
              type='bordered'
            >
              Choose File
              <input
                type='file'
                onChange={onFileSelected}
                accept='.xls,.xlsx'
              />
            </Button>
          </form>
          <div>{file && file.name}</div>
          <div className='mt-10 d-flex justify-content-end'>
            <a
              href={`${process.env.REACT_APP_API_URL}uploads/sample_budget_import.xlsx`}
              style={{ textDecoration: 'underline' }}
            >
              Download Sample
            </a>
          </div>
        </div>
      )}
      {uploading && (
        <div className='mt-20 mb-20'>
          <Spinner />
        </div>
      )}
    </InputModal>
  );
};

export default ImportBudget;
