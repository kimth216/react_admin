// base
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createCopyEventAsync } from '../../store/reducer/event';
import Form, { FormComponentProps } from 'antd/lib/form';

// modules
import {
  Button,
  Col,
  message,
  Modal,
  Descriptions,
  DatePicker,
  TimePicker,
} from 'antd';
import moment, { Moment } from 'moment';

// components
import { FlexRow } from '../../components';

// models, enums, types
import { CreateCopyEvent, } from 'models';

// less
import './index.less';

// lib
import { TIME_FORMAT, CLIENT_DATE_FORMAT} from 'lib/constants';

interface DateForm extends FormComponentProps {
  copyEventProp: CreateCopyEvent;
  setCopyEventProp: Dispatch<SetStateAction<CreateCopyEvent>>;
  onCancel: () => void;
}

const DateForm = Form.create<DateForm>()((props: DateForm) => {
  const { form, copyEventProp } = props;
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;
  const dispatch = useDispatch();


  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    validateFieldsAndScroll((error, values: CreateCopyEvent) => {
      if (!error) {

        const {
          salesStarted,
          salesEnded,
          shippingScheduled,
        } = values;

        const data: CreateCopyEvent = {
          eventId: copyEventProp.eventId,
          salesStarted: moment(salesStarted).format('YYYY-MM-DDTHH:mm'),
          salesEnded: moment(salesEnded).format('YYYY-MM-DDTHH:mm'),
          shippingScheduled: moment(shippingScheduled).format(CLIENT_DATE_FORMAT),
        };

        dispatch(createCopyEventAsync.request({ data }));

      } else {
        Object.keys(error).map(key => message.error(error[key].errors[0].message));
      }
    });
  };

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, []);

  return (
    <div className="event-date-form">
      <Form onSubmit={handleSubmit}>
        <Descriptions
          bordered
          column={24}
          title={(
            <div>
              <p>* 반드시 공구정보(공구기간, 배송예정일)의 기입사항을 확인하여 </p>
              <p style={{marginLeft: '12px'}}>공구를 복사해 주시기 바랍니다.</p>
            </div>)}
          >
          <Descriptions.Item label=" * 공구 시작일" span={24}>
            <FlexRow>
              <Col>
                <Form.Item>{getFieldDecorator('salesStarted')(<DatePicker placeholder="시작일" />)}</Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('salesStarted', {
                    rules: [
                      {
                        required: true,
                        message: '시작일을 입력해주세요.',
                      },
                    ],
                  })(
                    <TimePicker
                      use12Hours
                      placeholder="시작시간"
                      defaultOpenValue={moment('00:00 AM', TIME_FORMAT)}
                      format={TIME_FORMAT}
                    />,
                  )}
                </Form.Item>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label=" * 공구 종료일" span={24}>
            <FlexRow>
              <Col>
                <Form.Item>{getFieldDecorator('salesEnded')(<DatePicker placeholder="종료일" />)}</Form.Item>
              </Col>
              <Col>
                <Form.Item>
                  {getFieldDecorator('salesEnded', {
                    rules: [
                      {
                        required: true,
                        message: '종료일을 입력해주세요.',
                      },
                    ],
                  })(
                    <TimePicker
                      use12Hours
                      placeholder="종료시간"
                      defaultOpenValue={moment('00:00 AM', TIME_FORMAT)}
                      format={TIME_FORMAT}
                    />,
                  )}
                </Form.Item>
              </Col>
            </FlexRow>
          </Descriptions.Item>
          <Descriptions.Item label=" * 배송 예정일" span={24}>
            <FlexRow>
              <Col>
                <Form.Item>
                  {getFieldDecorator('shippingScheduled', {
                    rules: [
                      {
                        required: true,
                        message: '배송 예정일 선택해주세요.',
                      },
                      {
                        validator: (rule, value: Moment, callback) => {
                          if (value.isBefore(moment())) {
                            return callback('배송 에정일은 현재 시간보다 이전이여야 합니다.');
                          }
                          return callback();
                        },
                      },
                    ],
                  })(<DatePicker placeholder="배송 예정일" />)}
                </Form.Item>
              </Col>
            </FlexRow>
          </Descriptions.Item>
        </Descriptions>
        <div className="ant-modal-footer">
          <Button type="primary" htmlType="submit" >
            확인
          </Button>
        </div>
      </Form>
    </div>
  );
});

interface Props {
  copyEventProp: CreateCopyEvent;
  setCopyEventProp: Dispatch<SetStateAction<CreateCopyEvent>>;
  visible: boolean;
  onCancel?: () => void;
}

function EventDateModal(props: Props) {
  const { copyEventProp, setCopyEventProp, visible, onCancel } = props;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      title={(<div><p>공구 복사</p></div>)}
      visible={visible}
      width={600}
      destroyOnClose
      onCancel={handleCancel}
      footer={false}
    >
      <DateForm copyEventProp={copyEventProp} setCopyEventProp={setCopyEventProp} onCancel={handleCancel} />
    </Modal>
  );
}

export default EventDateModal;
