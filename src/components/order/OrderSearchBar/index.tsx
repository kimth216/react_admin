// base
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// modules
import { Button, Checkbox, Row, Col, Input, Icon, Select, Descriptions } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';

// store
import { clearEvents } from 'store/reducer/event';

// components
import OrderSearchDate, {
  getValueFromEventForSearchDate,
  getValuePropsForSearchDate,
  validateDate,
} from 'components/order/OrderSearchDate';

// types
import { ResponseProduct, SearchEventForOrder, ResponseOption } from 'types';

// utils
import { startDateFormat, endDateFormat } from 'lib/utils';

// enums
import { PAYMENT_STATUSES, SHIPPING_STATUSES, DEFAULT_PAYMENT_STATUSES, DEFAULT_SHIPPING_STATUSES } from 'enums';

// assets
import './index.less';
import { EventSearch } from 'components/event';
import EventSearchModal from 'components/event/EventSearch/EventSearchModal';

// define
const { Option } = Select;

export interface EventList {
  key: number;
  sales: string;
  name: string;
  eventStatus: string;
  products: ResponseProduct[];
}

interface Props extends FormComponentProps {
  onSearch: (value: { [props: string]: any }) => void;
  onReset: () => void;
}

const OrderSearchBar = Form.create<Props>()((props: Props) => {
  const { form, onSearch, onReset } = props;
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue, resetFields } = form;

  const dispatch = useDispatch();

  const [paymentChaeckALl, setPaymentCheckAll] = useState<boolean>(true);
  const [shippingCheckAll, setShippingCheckAll] = useState<boolean>(true);
  const [eventSearchModal, setEventSearchModal] = useState<boolean>(false);

  const [eventsData, setEventsData] = useState<EventList[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<EventList[]>([]);

  const handleChangePaymentStatuses = useCallback(values => {
    setPaymentCheckAll(values.length === PAYMENT_STATUSES.length);
  }, []);

  const handleChangeShippingStatuses = useCallback(values => {
    setShippingCheckAll(values.length === SHIPPING_STATUSES.length);
  }, []);

  const handleChangePaymentStatusesAll = useCallback(e => {
    setFieldsValue({
      paymentStatuses: e.target.checked ? DEFAULT_PAYMENT_STATUSES : [],
    });
    setPaymentCheckAll(e.target.checked);
  }, []);

  const handleChangeShippingStatusesAll = useCallback(e => {
    setFieldsValue({
      shippingStatuses: e.target.checked ? DEFAULT_SHIPPING_STATUSES : [],
    });
    setShippingCheckAll(e.target.checked);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();

      validateFields((errors, values) => {
        if (!errors) {
          Object.keys(values).forEach(key => {
            if (values[key] === undefined) {
              delete values[key];
              return;
            }
            if (key === 'date') {
              validateDate(values, 'date');
              return;
            }
            if (key === 'paymentStatuses') {
              if (paymentChaeckALl) {
                delete values[key];
                return;
              }
            }
            if (key === 'shippingStatuses') {
              if (shippingCheckAll) {
                delete values[key];
                return;
              }
            }
          });

          onSearch(values);
        }
      });
    },
    [onSearch, paymentChaeckALl, shippingCheckAll],
  );

  const handleReset = useCallback(() => {
    resetFields();
    setPaymentCheckAll(true);
    setShippingCheckAll(true);
    onReset();
  }, [onReset]);

  const handleEventSearchModal = (visable: boolean) => {
    setEventSearchModal(visable);
    setEventsData([]);
    dispatch(clearEvents());
  };

  return (
    <>
      <Form className="order-search-bar" onSubmit={handleSubmit}>
        <Descriptions title="주문 검색 조회" bordered column={24}>
          <Descriptions.Item label="검색어" span={24}>
            <Row type="flex" align="middle" style={{ marginBottom: 15 }}>
              <Col className="text-align-center" span={4}>
                <span>주문인</span>
              </Col>
              <Col span={4}>{getFieldDecorator('username')(<Input width={50} />)}</Col>
              <Col className="text-align-center" span={4}>
                <span>주문번호</span>
              </Col>
              <Col className="text-align-center" span={4}>
                {getFieldDecorator('orderNo')(<Input width={50} />)}
              </Col>
              <Col className="text-align-center" span={4}>
                <span>배송 받는 분</span>
              </Col>
              <Col span={4}>{getFieldDecorator('recipient')(<Input width={50} />)}</Col>
            </Row>
            <Row type="flex" align="middle">
              <Col className="text-align-center" span={4}>
                <span>송장번호</span>
              </Col>
              <Col span={4}>{getFieldDecorator('invoice')(<Input width={60} />)}</Col>
              <Col className="text-align-center" span={4}>
                <span>주문인 휴대폰 번호</span>
              </Col>
              <Col className="text-align-center" span={4}>
                {getFieldDecorator('phone')(<Input width={50} />)}
              </Col>
              <Col className="text-align-center" span={4}>
                <span>배송 받는 분 휴대폰 번호</span>
              </Col>
              <Col span={4}>{getFieldDecorator('recipientPhone')(<Input width={50} />)}</Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="공구명" span={24}>
            <Row>
              <Col span={24} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <Button type="primary" onClick={() => handleEventSearchModal(true)} style={{ width: 150 }}>
                  공구 검색
                </Button>
                <Icon type="search" style={{ fontSize: 20, marginLeft: 10 }} />
              </Col>
              <Col span={24}>{getFieldDecorator('events')(<EventSearch selectedEvents={selectedEvents} />)}</Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="검색 기간" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('date', {
                    initialValue: [
                      moment(new Date()).format(startDateFormat),
                      moment(new Date()).format(endDateFormat),
                    ],
                    getValueFromEvent: getValueFromEventForSearchDate,
                    getValueProps: getValuePropsForSearchDate,
                  })(<OrderSearchDate />)}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="결제 상태" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <Checkbox onChange={handleChangePaymentStatusesAll} checked={paymentChaeckALl}>
                    전체
                  </Checkbox>
                  {getFieldDecorator('paymentStatuses', {
                    initialValue: DEFAULT_PAYMENT_STATUSES,
                  })(<Checkbox.Group options={PAYMENT_STATUSES} onChange={handleChangePaymentStatuses} />)}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label="배송 상태" span={24}>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <Checkbox onChange={handleChangeShippingStatusesAll} checked={shippingCheckAll}>
                    전체
                  </Checkbox>
                  {getFieldDecorator('shippingStatuses', {
                    initialValue: DEFAULT_SHIPPING_STATUSES,
                  })(<Checkbox.Group options={SHIPPING_STATUSES} onChange={handleChangeShippingStatuses} />)}
                </Form.Item>
              </Col>
            </Row>
          </Descriptions.Item>
        </Descriptions>
        <Form.Item>
          <Button htmlType="submit" type="primary" style={{ marginRight: 5 }}>
            검색
          </Button>
          <Button htmlType="button" onClick={handleReset}>
            초기화
          </Button>
        </Form.Item>
      </Form>
      <EventSearchModal
        eventSearchModal={eventSearchModal}
        handleEventSearchModal={handleEventSearchModal}
        eventsData={eventsData}
        setEventsData={setEventsData}
        setSelectedEvents={setSelectedEvents}
      />
    </>
  );
});

export default OrderSearchBar;
