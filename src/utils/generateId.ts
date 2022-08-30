import { customAlphabet } from 'nanoid'

const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * ランダムなIDを生成する
 *
 * generateId() => 16文字
 * generateId(32) => 32文字
 *
 * 16文字の場合、少なくとも1回の衝突が起きる確率が1％になるためには、〜981年かかる
 * → https://zelark.github.io/nano-id-cc/
 */
export const generateId = customAlphabet(alphabet, 16)
