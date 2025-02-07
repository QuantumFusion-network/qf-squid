import {sts, Result, Option, Bytes, BitSequence} from './support'

export const AccountId32 = sts.bytes()

export const Hash = sts.bytes()

export const ByteString = sts.bytes()

export const CalculationResult = sts.bigint()
