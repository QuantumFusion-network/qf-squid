import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Balance = sts.bigint()

export const AccountId = sts.bytes()

export const Hash = sts.bytes()

export const ByteString = sts.bytes()

export const CalculationResult = sts.bigint()
