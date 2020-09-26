import request from "../index";
import requestMultiPart from "../multipart";
import axios from "axios";
import { Platform, AsyncStorage } from 'react-native';

export function loginApi(data) {
  return request({
    url: `login`,
    method: "POST",
    data: data,
  });
}

export function otp(data) {
  return request({
    url: `otp_verify`,
    method: "POST",
    data: data,
  });
}

export function getPageData(data) {
  return request({
    url: data,
    method: "GET",
  });
}

export function getProfileData(data) {
  return request({
    url: `getUserProfileAllData/` + data,
    method: "GET",
  });
}

export function register(data) {
  return request({
    url: `register`,
    method: "POST",
    data: data,
  });
}

export function save_personal_details(data) {
  return request({
    url: `save_personal_details`,
    method: "POST",
    data: data,
  });
}

export function stage1Api(data) {
  return requestMultiPart({
    url: `save_personal_details`,
    method: "POST",
    data: data,
  });
}

export function stage2Api(data) {
  return requestMultiPart({
    url: `save_licence_details`,
    method: "POST",
    data: data,
  });
}

export function stage3Api(data) {
  return requestMultiPart({
    url: `save_corporation_details`,
    method: "POST",
    data: data,
  });
}

export function stage4Api(data) {
  return requestMultiPart({
    url: `save_reference_details`,
    method: "POST",
    data: data,
  });
}

export function getCommissionCount(data) {
  return requestMultiPart({
    url: `GetCommissionCount`,
    method: "POST",
    data: data,
  });
}

export function getAllMyCommissionList(data) {
  return requestMultiPart({
    url: `GetAllMyCommissionList`,
    method: "POST",
    data: data,
  });
}

export function getPolicy(data) {
  return request({
    url: `getMyPolicy`,
    method: "POST",
    data: data,
  });
}

export function getMyQuote(data) {
  return request({
    url: `getMyQuote`,
    method: "POST",
    data: data,
  });
}

export function editQuote(data) {
  return request({
    url: `updateQuote`,
    method: "POST",
    data: data,
  });
}

export function getMyQuoteMail(data) {
  return request({
    url: `mailquote`,
    method: "POST",
    data: data,
  });
}

export function cancelQuote(data) {
  return request({
    url: `cancelQuote`,
    method: "POST",
    data: data,
  });
}

export function getPlan() {
  return request({
    url: `getPlan`,
    method: "GET",
  });
}

export function getDeductible(data) {
  return requestMultiPart({
    url: `getDeductible`,
    method: "POST",
    data: data,
  });
}

export function calculatePremium(data) {
  return requestMultiPart({
    url: `getQuote`,
    method: "POST",
    data: data,
  });
}

export function saveQuote(data) {
  return requestMultiPart({
    url: `saveQuote`,
    method: "POST",
    data: data,
  });
}

export function getActiveEnsured(data) {
  return requestMultiPart({
    url: `getActiveInsured/` + data,
    method: "GET",
  });
}

export function getInsuredPremiumAmount(data) {
  return requestMultiPart({
    url: `get_insured_details`,
    method: "POST",
    data: data
  });
}

export function savePolicy(data) {
  return requestMultiPart({
    url: `save_policy`,
    method: "POST",
    data: data,
  });
}

export function getQuoteById(data) {
  return requestMultiPart({
    url: `getQuoteById/` + data,
    method: "GET",
  });
}

export function getPolicyLimit() {
  return request({
    url: `getPolicyLimit`,
    method: "GET",
  });
}
export function getPolicyById(data) {
  return requestMultiPart({
    url: `getPolicyById/` + data,
    method: "GET",
  });
}

export function viewPolicy(data) {
  return requestMultiPart({
    url: `view_policy`,
    method: "POST",
    data: data,
  });
}

export function cancelPolicy(data) {
  return requestMultiPart({
    url: `cancel_policy_endorsement`,
    method: "POST",
    data: data,
  });
}
export function emailPolicy(data) {
  return requestMultiPart({
    url: `mailPolicy`,
    method: "POST",
    data: data,
  });
}

export function getRole(data) {
  return requestMultiPart({
    url: `getAllRole/` + data,
    method: "GET",
  });
}

export function getVoidDocument() {
  return requestMultiPart({
    url: `getVoidDocumentTypes`,
    method: "GET",
  });
}

export function forgotPassword(data) {
  return request({
    url: `verify_email`,
    method: "POST",
    data: data,
  });
}
export function resetPassword(data) {
  return request({
    url: `verify_email`,
    method: "POST",
    data: data,
  });
}
export function getcancelPolicy() {
  return request({
    url: `getPolicyById`,
    method: "GET",
  });
}
export function cancelMidtermApi(data) {
  return request({
    url: `save_refund_endorsement`,
    method: "POST",
    data:data
  });
}


export async function cancelCorrectionFin(data) {
  return requestMultiPart({
    url: `save_financecorrection_endorsement`,
    method: "POST",
    data:data
  });
}


export async function cancelVoid(data) {
  return requestMultiPart({
    url: `save_voidSVVTC_endorsement`,
    method: "POST",
    data:data
  });
}


export async function cancelCorrectionNonFin(data) {
  return request({
    url: `save_nonfinancecorrection_endorsement`,
    method: "POST",
    data:data
  });
}

