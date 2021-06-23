import { Balances } from '../@types/types'
import { nativeToUi } from '@blockworks-foundation/mango-client'
import useMarketList from './useMarketList'
import useMangoStore from '../stores/useMangoStore'
import {
  // displayBorrowsForMarginAccount,
  // displayDepositsForMarginAccount,
  floorToDecimal,
} from '../utils'
import useAllMarkets from './useAllMarkets'
import { sumBy } from 'lodash'
import { QUOTE_INDEX } from '@blockworks-foundation/mango-client/lib/src/MerpsGroup'
import { I80F48 } from '@blockworks-foundation/mango-client/lib/src/fixednum'

export function useBalances(): Balances[] {
  const balances = []
  const mangoGroup = useMangoStore((s) => s.selectedMangoGroup.current)
  const marginAccount = useMangoStore((s) => s.selectedMarginAccount.current)
  const mangoGroupConfig = useMangoStore((s) => s.selectedMangoGroup.config)
  const mangoCache = useMangoStore((s) => s.selectedMangoGroup.cache)

  for (const {
    marketIndex,
    baseSymbol,
    name,
  } of mangoGroupConfig.spotMarkets) {
    if (!marginAccount || !mangoGroup) {
      return []
    }

    const openOrders: any = marginAccount.spotOpenOrdersAccounts[marketIndex]
    const quoteCurrencyIndex = QUOTE_INDEX

    const nativeBaseFree = openOrders?.baseTokenFree || 0
    const nativeQuoteFree =
      (openOrders?.quoteTokenFree || 0) +
      (openOrders?.['referrerRebatesAccrued'].toNumber() || 0)

    const nativeBaseLocked = openOrders
      ? openOrders.baseTokenTotal - openOrders?.baseTokenFree
      : 0
    const nativeQuoteLocked = openOrders
      ? openOrders?.quoteTokenTotal - (openOrders?.quoteTokenFree || 0)
      : 0

    const tokenIndex = marketIndex

    const net = (locked, currencyIndex) => {
      const amount = marginAccount
        .getNativeDeposit(
          mangoCache.rootBankCache[currencyIndex],
          currencyIndex
        )
        .add(
          I80F48.fromNumber(locked).sub(
            marginAccount.getNativeBorrow(
              mangoCache.rootBankCache[currencyIndex],
              currencyIndex
            )
          )
        )

      return amount.toString()
      // return floorToDecimal(
      //   nativeToUi(amount, mangoGroup.tokens[currencyIndex].decimals),
      //   mangoGroup.tokens[currencyIndex].decimals
      // )
    }

    const marketPair = [
      {
        market: null,
        key: `${baseSymbol}${name}`,
        coin: baseSymbol,
        marginDeposits: marginAccount
          .getUiDeposit(
            mangoCache.rootBankCache[tokenIndex],
            mangoGroup,
            tokenIndex
          )
          .toString(),
        borrows: marginAccount
          .getUiBorrow(
            mangoCache.rootBankCache[tokenIndex],
            mangoGroup,
            tokenIndex
          )
          .toString(),
        orders: nativeToUi(
          nativeBaseLocked,
          mangoGroup.tokens[tokenIndex].decimals
        ),
        unsettled: nativeToUi(
          nativeBaseFree,
          mangoGroup.tokens[tokenIndex].decimals
        ),
        net: net(nativeBaseLocked, tokenIndex),
      },
      {
        market: null,
        key: `${name}`,
        coin: mangoGroupConfig.quoteSymbol,
        marginDeposits: marginAccount
          .getUiDeposit(
            mangoCache.rootBankCache[quoteCurrencyIndex],
            mangoGroup,
            quoteCurrencyIndex
          )
          .toString(),
        borrows: marginAccount
          .getUiBorrow(
            mangoCache.rootBankCache[tokenIndex],
            mangoGroup,
            quoteCurrencyIndex
          )
          .toString(),
        orders: nativeToUi(
          nativeQuoteLocked,
          mangoGroup.tokens[quoteCurrencyIndex].decimals
        ),
        unsettled: nativeToUi(
          nativeQuoteFree,
          mangoGroup.tokens[quoteCurrencyIndex].decimals
        ),
        net: net(nativeQuoteLocked, quoteCurrencyIndex),
      },
    ]
    balances.push(marketPair)
  }

  const baseBalances = balances.map((b) => b[0])
  // const quoteBalances = balances.map((b) => b[1])
  // const quoteMeta = quoteBalances[0]
  // const quoteInOrders = sumBy(quoteBalances, 'orders')
  // const unsettled = sumBy(quoteBalances, 'unsettled')
  // const net =
  //   quoteMeta.marginDeposits + unsettled - quoteMeta.borrows - quoteInOrders

  // return baseBalances.concat([
  //   {
  //     market: null,
  //     key: `${quoteMeta.coin}${quoteMeta.coin}`,
  //     coin: quoteMeta.coin,
  //     marginDeposits: quoteMeta.marginDeposits,
  //     borrows: quoteMeta.borrows,
  //     orders: quoteInOrders,
  //     unsettled,
  //     net: floorToDecimal(net, mangoGroup.tokens[QUOTE_INDEX].decimals),
  //   },
  // ])

  return baseBalances
}
