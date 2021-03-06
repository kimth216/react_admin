// base
import { produce } from 'immer';
import { AnyAction } from 'redux';
import { createAsyncAction, action } from 'typesafe-actions';
import { AxiosError, AxiosResponse } from 'axios';

// actions
import * as Actions from 'store/action/eventAction';

// types
import {
  ResponseEventForList,
  GetListRequestPayload,
  PageWrapper,
  ResponseEvent,
  CreateRequestPayload,
  CreateEvent,
  GetRequestPayload,
  UpdateRequestPayload,
  UpdateEvent,
  UpdateEventNotices,
  UpdateEventStatus,
  RequestAsyncAction,
  ResponseAsyncAction,
  ErrorAsyncAction,
  CreateCopyEvent,
  ResponseCopyEvent,
  ResponseEventForUrl,
  GetSearchEventByUrl,
} from 'models';

import { EventStatus } from 'enums';

export interface EventState {
  events: PageWrapper<ResponseEventForList>;
  event: ResponseEvent;
  copyEvent: ResponseCopyEvent;
  eventByUrl:ResponseEventForUrl;
}

// 공구 생성
export const createEventAsync = createAsyncAction(
  Actions.CREATE_EVENT_REQUEST,
  Actions.CREATE_EVENT_SUCCESS,
  Actions.CREATE_EVENT_FAILURE,
)<CreateRequestPayload<CreateEvent>, {eventId : number}, AxiosError>();

// 공구 생성
export const createCopyEventAsync = createAsyncAction(
  Actions.CREATE_COPY_EVENT_REQUEST,
  Actions.CREATE_COPY_EVENT_SUCCESS,
  Actions.CREATE_COPY_EVENT_FAILURE,
)<CreateRequestPayload<CreateCopyEvent>, ResponseCopyEvent, AxiosError>();

// 공구 목록 조회
export const getEventsAsync = createAsyncAction(
  Actions.GET_EVENTS_REQUEST,
  Actions.GET_EVENTS_SUCCESS,
  Actions.GET_EVENTS_FAILURE,
)<GetListRequestPayload, AxiosResponse, AxiosError>();

// 공구 조회
export const getEventByIdAsync = createAsyncAction(
  Actions.GET_EVENT_REQUEST,
  Actions.GET_EVENT_SUCCESS,
  Actions.GET_EVENT_FAILURE,
)<GetRequestPayload, AxiosResponse, AxiosError>();

// 공구  URL 로 조회
export const getEventByUrlAsync = createAsyncAction(
  Actions.GET_EVENT_BY_URL_REQUEST,
  Actions.GET_EVENT_BY_URL_SUCCESS,
  Actions.GET_EVENT_BY_URL_FAILURE,
)<GetSearchEventByUrl, AxiosResponse, AxiosError>();

// 공구 수정
export const updateEventByIdAsync = createAsyncAction(
  Actions.UPDATE_EVENT_REQUEST,
  Actions.UPDATE_EVENT_SUCCESS,
  Actions.UPDATE_EVENT_FAILURE,
)<UpdateRequestPayload<UpdateEvent>, AxiosResponse, AxiosError>();

// 공구 공지 생성
export const updateEventNoticesAsync = createAsyncAction(
  Actions.UPDATE_EVENT_NOTICES_REQUEST,
  Actions.UPDATE_EVENT_NOTICES_SUCCESS,
  Actions.UPDATE_EVENT_NOTICES_FAILURE,
)<UpdateRequestPayload<UpdateEventNotices>, AxiosResponse, AxiosError>();

// 공구 오픈
export const updateEventStatusAsync = createAsyncAction(
  Actions.UPDATE_EVENT_STATUS_REQUEST,
  Actions.UPDATE_EVENT_STATUS_SUCCESS,
  Actions.UPDATE_EVENT_STATUS_FAILURE,
)<UpdateRequestPayload<UpdateEventStatus>, AxiosResponse, AxiosError>();

export const updateEventShippingFeeInfoAsync = createAsyncAction(
  Actions.UPDATE_EVENT_SHIPPING_FEE_INFO_REQUEST,
  Actions.UPDATE_EVENT_SHIPPING_FEE_INFO_SUCCESS,
  Actions.UPDATE_EVENT_SHIPPING_FEE_INFO_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

export const updateEventShippingAsync = createAsyncAction(
  Actions.UPDATE_EVENT_SHIPPING_REQUEST,
  Actions.UPDATE_EVENT_SHIPPING_SUCCESS,
  Actions.UPDATE_EVENT_SHIPPING_FAILURE,
)<RequestAsyncAction, ResponseAsyncAction, ErrorAsyncAction>();

// 공구 삭제
export const deleteEventAsync = createAsyncAction(
  Actions.DELETE_EVENT_REQUEST,
  Actions.DELETE_EVENT_SUCCESS,
  Actions.DELETE_EVENT_FAILURE,
)<RequestAsyncAction, void, ErrorAsyncAction>();


export const clearEvent = () => action(Actions.CLEAR_EVENT);
export const clearEvents = () => action(Actions.CLEAR_EVENTS);
export const clearEventByUrl = () => action(Actions.CLEAR_EVENT_BY_URL);
export const clearCopyEvent = () => action(Actions.CLEAR_COPY_EVENT);

const initialState: EventState = {
  copyEvent:{
    eventId: 0,
  },
  eventByUrl : {
    eventId: 0,
    eventUrl:'',
    name: '',
    brand: {
      brandId: 0,
      brandName: '',
    },
    salesStarted: '',
    salesEnded: '',
    creator: {
      loginId: '',
      avatar: {
        bucketName: '',
        fileKey: '',
        fileMetadata: {
          contentLength: 0,
          contentType: '',
        },
        fileName: '',
      },
      username: '',
      sns: {
        instagramFollowers: '',
        youtubeSubscriberCount: '',
      },
    },
  },
  events: {
    content: [],
    first: false,
    last: false,
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  },
  event: {
    eventUrl:'',
    shippingPeriod: '',
    cancellationExchangeReturnRegulationAgree: false,
    cancellationExchangeReturnAgree: false,
    productProvisions: [],
    eventId: 0,
    name: '',
    eventStatus: EventStatus[EventStatus.READY],
    turn: 0,
    brand: {
      brandId: 0,
      brandName: '',
    },
    salesStarted: '',
    salesEnded: '',
    created: '',
    choiceReview: '',
    detail: '',
    targetAmount: 0,
    videoUrl: '',
    shippingCompany: '',
    shippingFeeInfo: {
      shippingFee: 0,
      shippingFreeCondition: 0,
    },
    shippingScheduled: '',
    images: [],
    celebReview: {
      created: '',
      contents: null,
      modified: null,
    },
    products: [],
    eventNotices: [],
    likeCnt: 0,
    creator: {
      loginId: '',
      avatar: {
        bucketName: '',
        fileKey: '',
        fileMetadata: {
          contentLength: 0,
          contentType: '',
        },
        fileName: '',
      },
      username: '',
      sns: {
        instagramFollowers: '',
        youtubeSubscriberCount: '',
      },
    },
  },
};

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case Actions.CREATE_EVENT_SUCCESS: {
      return state;
    }
    case Actions.CREATE_COPY_EVENT_SUCCESS: {
      return produce(state, draft => {
       draft.copyEvent = {eventId : action.payload};
      });
    }
    case Actions.GET_EVENTS_SUCCESS: {
      return produce(state, draft => {
        draft.events = action.payload;
      });
    }
    case Actions.GET_EVENT_BY_URL_SUCCESS: {
      return produce(state, draft => {
        draft.eventByUrl = action.payload;
      });
    }
    case Actions.GET_EVENT_SUCCESS: {
      return produce(state, draft => {
        draft.event = action.payload;
      });
    }
    case Actions.UPDATE_EVENT_NOTICES_SUCCESS:
    case Actions.UPDATE_EVENT_STATUS_SUCCESS:
    case Actions.DELETE_EVENT_SUCCESS: {
      return state;
    }
    case Actions.UPDATE_EVENT_SHIPPING_FEE_INFO_SUCCESS: {
      return produce(state, draft => {
        draft.event.shippingFeeInfo = action.payload.shippingFeeInfo;
      });
    }
    case Actions.CLEAR_EVENT: {
      return produce(state, draft => {
        draft.event = initialState.event;
      });
    }

    case Actions.CLEAR_EVENTS: {
      return produce(state, draft => {
        draft.events = { content: [], first: false, last: false, totalElements: 0, totalPages: 0, page: 0, size: 10 };
      });
    }
    case Actions.CLEAR_EVENT_BY_URL: {
      return produce(state, draft => {
        draft.eventByUrl = initialState.eventByUrl;
      });
    }
    case Actions.UPDATE_EVENT_SHIPPING_SUCCESS: {
      return state;
    }


    case Actions.CLEAR_COPY_EVENT: {
      return produce(state, draft => {
        draft.copyEvent = { eventId: 0 };
      });
    }

    default: {
      return state;
    }
  }
};
