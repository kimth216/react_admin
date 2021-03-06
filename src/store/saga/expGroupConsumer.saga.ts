// base
import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import { message } from 'antd';
import qs from 'qs';

// lib
import * as Api from 'lib/protocols';

// actions
import { PayloadAction } from 'typesafe-actions';
import * as Actions from 'store/action/expGroupConsumer.action';
import {
  getExpGroupConsumersByIdAsync,
  updateExpGroupConsumersPrizeAsync,
  updateExpGroupConsumerExposeByIdAsync,
  getExpGroupConsumerByIdAsync,
  updateExpGroupConsumerByIdAsync,
  getExpGroupConsumersExcelByIdAsync,
} from 'store/action/expGroupConsumer.action';

// models
import {
  SearchExperienceGroupConsumer,
  UpdateExperienceGroupConsumersPrize,
  UpdateExperienceGroupConsumerExpose,
  UpdateExperienceGroupConsumer,
  ResponseSearchExperienceGroupConsumers,
} from 'models';
import { createExcel } from 'lib/utils';

function* getExpGroupConsumers(
  action: PayloadAction<string, { id: number; page: number; size: number; params: SearchExperienceGroupConsumer }>,
) {
  const { id, page, size, params } = action.payload;

  try {
    const res = yield call(() =>
      Api.get(`/experience-groups/${id}/consumers`, {
        params: { page, size, ...params },
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );

    yield put(getExpGroupConsumersByIdAsync.success(res.data));
  } catch (error) {
    yield put(getExpGroupConsumersByIdAsync.failure(error));
  }
}

function* updateExpGroupConsumersPrize(action: PayloadAction<string, { data: UpdateExperienceGroupConsumersPrize }>) {
  const { data } = action.payload;
  try {
    yield call(() => Api.put(`/experience-groups/consumers/prize`, data));
    yield put(updateExpGroupConsumersPrizeAsync.success(data));
  } catch (error) {
    yield put(updateExpGroupConsumersPrizeAsync.failure(error));
  }
}

function* updateExpGroupConsumerExposeById(
  action: PayloadAction<string, { id: number; data: UpdateExperienceGroupConsumerExpose }>,
) {
  const { id, data } = action.payload;

  try {
    yield call(() => Api.put(`/experience-groups/consumer/${id}/expose`, data));
    yield put(updateExpGroupConsumerExposeByIdAsync.success());
  } catch (error) {
    yield put(updateExpGroupConsumerExposeByIdAsync.failure(error));
  }
}

function* getExpGroupConsumerById(action: PayloadAction<string, { id: number }>) {
  const { id } = action.payload;

  try {
    const res = yield call(() => Api.get(`/experience-groups/consumers/${id}`));

    yield put(getExpGroupConsumerByIdAsync.success(res.data));
  } catch (error) {
    yield put(getExpGroupConsumerByIdAsync.failure(error));
  }
}

function* updateExpGroupConsumerById(
  action: PayloadAction<string, { id: number; data: UpdateExperienceGroupConsumer }>,
) {
  const { id, data } = action.payload;

  try {
    yield call(() => Api.put(`/experience-groups/consumers/${id}`, data));

    yield put(updateExpGroupConsumerByIdAsync.success());
    yield put(getExpGroupConsumerByIdAsync.request({ id }));
    yield message.success('체험단 리뷰 수정이 완료되었습니다.');
  } catch (error) {
    yield put(updateExpGroupConsumerByIdAsync.failure(error));
  }
}

function* getExpGroupConsumersExcelById(
  action: PayloadAction<string, { id: number; params: SearchExperienceGroupConsumer }>,
) {
  const { id, params } = action.payload;

  try {
    const res = yield call(() =>
      Api.get(`/experience-groups/${id}/consumers/excel`, {
        params,
        paramsSerializer: (params: any) => qs.stringify(params, { arrayFormat: 'indices', allowDots: true }),
      }),
    );

    yield put(getExpGroupConsumersExcelByIdAsync.success(res.data));
  } catch (error) {
    yield put(getExpGroupConsumersExcelByIdAsync.failure(error));
  }
}

export default function* expGroupConsumerSaga() {
  yield takeEvery(Actions.GET_EXP_GROUP_CONSUMERS_BY_ID_REQUEST, getExpGroupConsumers);
  yield takeLatest(Actions.UPDATE_EXP_GROUP_CONSUMERS_PRIZE_REQUEST, updateExpGroupConsumersPrize);
  yield takeLatest(Actions.UPDATE_EXP_GROUP_CONSUMER_EXPOSE_BY_ID_REQUEST, updateExpGroupConsumerExposeById);
  yield takeEvery(Actions.GET_EXP_GROUP_CONSUMER_BY_ID_REQUEST, getExpGroupConsumerById);
  yield takeLatest(Actions.UPDATE_EXP_GROUP_CONSUMER_BY_ID_REQUEST, updateExpGroupConsumerById);
  yield takeEvery(Actions.GET_EXP_GROUP_CONSUMERS_EXCEL_BY_ID_REQUEST, getExpGroupConsumersExcelById);
}
