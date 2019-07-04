import React, { useCallback } from 'react';
import { Form, Select, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { QnaStatus } from 'enums';
import { SearchDate } from 'components';
import { useSelector } from 'react-redux';
import { StoreState } from 'store';
import { SearchContact } from 'types';

interface Props extends FormComponentProps {
  getData: (page: number, size?: number, searchCondition?: SearchContact) => void;
}

const ContactSearch = Form.create<Props>()((props: Props) => {
  const { form, getData } = props;
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;

  const pageSize = useSelector((state: StoreState) => state.contact.contacts.size);

  const handleSearch = useCallback(() => {
    validateFieldsAndScroll((err, val) => {
      if (!err) {
        Object.keys(val).forEach(key => {
          if (val[key] === undefined) {
            delete val[key];
            return;
          }
          if (key === 'status' && val[key] === 'ENTIRE') {
            delete val[key];
            return;
          }
          if (key === 'date') {
            if (val[key].length > 0) {
              val.startDate = val[key][0].startOf('day').format('YYYY-MM-DDTHH:mm:ss');
              val.endDate = val[key][1].endOf('day').format('YYYY-MM-DDTHH:mm:ss');
            }
            delete val[key];
            return;
          }
        });
        getData(0, pageSize, val);
      }
    });
  }, [validateFieldsAndScroll]);

  const handleReset = useCallback(() => {
    resetFields();
    getData(0);
  }, [resetFields, getData]);

  return (
    <Form layout="inline">
      <Form.Item>
        {getFieldDecorator('status', {
          initialValue: 'ENTIRE',
        })(
          <Select style={{ width: 120 }}>
            <Select.Option value="ENTIRE">전체</Select.Option>
            {Object.keys(QnaStatus).map((key: any) => (
              <Select.Option key={key} value={key}>
                {QnaStatus[key]}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item>{getFieldDecorator('keyword')(<Input />)}</Form.Item>
      <Form.Item>{getFieldDecorator('date')(<SearchDate />)}</Form.Item>
      <Button onClick={handleSearch} type="primary" style={{ marginRight: 5 }}>
        검색
      </Button>
      <Button onClick={handleReset}>초기화</Button>
    </Form>
  );
});

export default ContactSearch;
