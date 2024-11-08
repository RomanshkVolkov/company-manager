import { DepositSummary, SaleSummary, Sale } from '@/app/types/dashboard';
import { fetchDepositsSummary, fetchSalesSummary } from '../db/data/dashboard';
import { Prisma } from '@prisma/client';
import { getAllAssignedTerminals, getTerminalsByUser } from './user.service';

type GetCumulativeResults = {
  terminalFilter: Prisma.Sql;
  clientFilter: Prisma.Sql;
  clientServiceCost: number;
  isCommissionApplicable: boolean;
  params?: {
    from?: string;
    to?: string;
  };
};

export class DashboardService {
  /**
   * Get a date range from the provided search parameters.
   *
   * This method extracts `from` and `to` dates from the provided search parameters.
   * If the `from` or `to` parameters are not present, it defaults to a date range from one month ago to today.
   *
   * The resulting `to` date is adjusted to include the full day by adding one day to the
   * specified or default `to` date.
   *
   * @param searchParams - An optional object containing `from` and `to` string parameters.
   *                       Both parameters are expected to be in ISO date format (YYYY-MM-DD).
   *                       If these parameters are not provided, defaults will be used.
   *
   * @example
   * // Query parameters provided:
   * const range = BusinessLogic.getDateRangeFromSearchParams({ from: '2024-07-01', to: '2024-07-31' });
   * console.log(range); // { from: '2024-07-01', to: '2024-08-01' }
   *
   * @example
   * // Query parameters not provided:
   * const range = BusinessLogic.getDateRangeFromSearchParams();
   * console.log(range); // { from: '2024-07-01', to: '2024-08-01' } (assuming today is 2024-08-01)
   */
  static getDateRangeFromSearchParams(searchParams?: {
    from?: string;
    to?: string;
  }) {
    const defaultFromDate = new Date();
    defaultFromDate.setMonth(defaultFromDate.getMonth() - 1);

    const from =
      searchParams?.from || defaultFromDate.toISOString().split('T')[0];
    let to = searchParams?.to || new Date().toISOString().split('T')[0];

    const toDate = new Date(to);
    toDate.setDate(toDate.getDate() + 1);
    to = toDate.toISOString().split('T')[0];

    return { from, to };
  }

  /**
   * Retrieve a sorted list of unique dates from sales and deposits.
   *
   * This method extracts the dates from the sales and deposits arrays,
   * formats them as ISO strings (YYYY-MM-DD), and combines them into
   * a single list of unique dates. The resulting list is sorted in ascending order.
   *
   * This is useful when you have separate sales and deposit data over a given
   * date range and need to consolidate the dates to perform further analysis or
   * calculations.
   *
   * @param sales - An array of sales summaries, each containing a date.
   * @param deposits - An array of deposit summaries, each containing a date.
   * @returns A sorted array of unique date strings in ISO format (YYYY-MM-DD).
   *
   * @example
   * const uniqueDates = BusinessLogic.getUniqueDateFromSalesAndDeposits(salesData, depositsData);
   * console.log(uniqueDates); // ['2024-07-01', '2024-07-02', '2024-07-03']
   */
  static getUniqueDateFromSalesAndDeposits(
    sales: SaleSummary[],
    deposits: DepositSummary[]
  ) {
    const saleDates = sales.map(
      (sale) => sale.date.toISOString().split('T')[0]
    );
    const depositDates = deposits.map(
      (deposit) => deposit.date.toISOString().split('T')[0]
    );

    const allDates = Array.from(
      new Set([...saleDates, ...depositDates])
    ).sort();
    return allDates;
  }

  /**
   * Calculate the sales with balance details for the given unique dates.
   *
   * This method calculates the sales amount, commission, and balance for each date,
   * and also calculates the service cost based on the client's service cost percentage.
   *
   * @param sales - An array of sales objects to be processed.
   * @param uniqueDates - An array of unique dates for which the sales should be calculated.
   * @param clientServiceCost - The service cost percentage applied to the sales.
   * @returns An array of objects containing the date, sales amount, commission, balance,
   * service cost percentage, and service cost amount.
   */
  static calculateSalesWithBalance({
    sales,
    uniqueDates,
    clientServiceCost,
  }: {
    sales: SaleSummary[];
    uniqueDates: string[];
    clientServiceCost: number;
  }): Omit<Sale, 'totalDeposits' | 'availableBalance' | 'cumulativeBalance'>[] {
    const salesWithBalance = uniqueDates.map((date) => {
      const sale = sales.find(
        (sale) => sale.date.toISOString().split('T')[0] === date
      );
      const salesAmount = sale ? sale.amount?.toNumber() || 0 : 0;
      const commission = sale ? sale.commission?.toNumber() || 0 : 0;
      const balance = salesAmount - commission;

      return {
        date,
        sales: salesAmount,
        commission,
        balance,
        serviceCost: String(clientServiceCost),
        serviceCostAmount: salesAmount * (clientServiceCost / 100),
      };
    });

    return salesWithBalance;
  }

  /**
   * Calculate deposits with sales and available balance.
   *
   * This method processes an array of sales and an array of deposits to calculate
   * the total deposits and available balance for each sale. It matches each sale
   * with a corresponding deposit by date and then calculates the `totalDeposits`
   * and `availableBalance` based on the sales, commission, and service cost amounts.
   *
   * @param params - An object containing the sales and deposits arrays.
   * @param params.sales - An array of sales objects, excluding `totalDeposits` and `availableBalance`.
   * @param params.deposits - An array of deposit summaries, each containing a date and total amount.
   * @returns An array of sales objects with `totalDeposits` and `availableBalance` calculated and included.
   *
   */
  static calculateDepositsWithSalesAndBalance({
    sales,
    deposits,
  }: {
    sales: Omit<
      Sale,
      'totalDeposits' | 'availableBalance' | 'cumulativeBalance'
    >[];
    deposits: DepositSummary[];
  }): Omit<Sale, 'cumulativeBalance'>[] {
    const depositsWithBalance = sales.map((sale) => {
      const deposit = deposits.find(
        (deposit) => deposit.date.toISOString().split('T')[0] === sale.date
      );

      const totalDeposits = deposit ? deposit.total?.toNumber() : 0;

      return {
        date: sale.date,
        sales: sale.sales,
        commission: sale.commission,
        balance: sale.balance,
        serviceCost: sale.serviceCost,
        serviceCostAmount: sale.serviceCostAmount,
        totalDeposits,
        availableBalance: sale.balance - totalDeposits - sale.serviceCostAmount,
      };
    });

    return depositsWithBalance;
  }

  /**
   * Calculate the cumulative balance for a series of sales.
   *
   * This method takes an array of sales objects, each containing an `availableBalance`,
   * and calculates the cumulative balance over time. It iterates through the sales,
   * adding the `availableBalance` of each sale to a running total, and attaches this
   * cumulative balance to each sale object.
   *
   * @param sales - An array of sales objects, each containing an `availableBalance`.
   * @returns An array of sales objects, each with an additional `cumulativeBalance` field.
   *
   * @example
   * const salesWithCumulativeBalance = BusinessLogic.calculateCumulativeBalance(salesData);
   * console.log(salesWithCumulativeBalance);
   * // [
   * //   {
   * //     date: '2024-07-01',
   * //     availableBalance: 50,
   * //     cumulativeBalance: 50,
   * //   },
   * //   {
   * //     date: '2024-07-02',
   * //     availableBalance: 75,
   * //     cumulativeBalance: 125,
   * //   },
   * //   ...
   * // ]
   */
  static calculateCumulativeBalance(sales: Omit<Sale, 'cumulativeBalance'>[]) {
    let cumulativeBalance = 0;

    const resultsWithBalance: Sale[] = sales.map((sale) => {
      cumulativeBalance += sale.availableBalance;

      return {
        ...sale,
        cumulativeBalance,
      };
    });

    return resultsWithBalance;
  }

  /**
   * Formats sales data for chart display.
   *
   * This method formats the date in each sales entry using the provided date formatter
   * and returns an array of objects containing the formatted date along with the sales amount,
   * commission, and total deposits.
   *
   * @param sales - An array of sales objects containing raw date strings.
   * @param formatter - An `Intl.DateTimeFormat` instance used to format the date strings.
   * @returns An array of objects where each object contains a formatted date and the original
   *          sales, commission, and total deposits values.
   *
   * @example
   * const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
   * const formattedData = BusinessLogic.formatDataChart(salesData, formatter);
   * console.log(formattedData);
   * // [
   * //   {
   * //     date: 'Jul 1',
   * //     sales: 1000,
   * //     commission: 100,
   * //     totalDeposits: 800,
   * //   },
   * //   ...
   * // ]
   */
  static formatDataChart(sales: Sale[], formatter: Intl.DateTimeFormat) {
    const formattedData = sales.map((sale) => ({
      date: formatter.format(new Date(sale.date)),
      sales: sale.sales,
      commission: sale.commission,
      totalDeposits: sale.totalDeposits,
    }));

    return formattedData;
  }

  static async getCumulativeResults({
    params,
    terminalFilter,
    clientFilter,
    clientServiceCost,
    isCommissionApplicable,
  }: GetCumulativeResults) {
    const dateRange = DashboardService.getDateRangeFromSearchParams(params);

    const sales = await fetchSalesSummary({
      ...dateRange,
      terminalFilter,
      isCommissionApplicable,
    });
    const deposits = await fetchDepositsSummary({
      ...dateRange,
      clientFilter,
    });

    const uniqueDates = this.getUniqueDateFromSalesAndDeposits(sales, deposits);

    const salesWithBalance = this.calculateSalesWithBalance({
      sales,
      uniqueDates,
      clientServiceCost,
    });

    const depositsWithBalance = this.calculateDepositsWithSalesAndBalance({
      sales: salesWithBalance,
      deposits,
    });

    return this.calculateCumulativeBalance(depositsWithBalance);
  }

  /**
   * Select terminals for display based on the user's role and selected filters.
   *
   * This method retrieves a list of terminals to display on the dashboard or use in queries,
   * determining the appropriate terminals based on whether the user is a client
   * and any selected client filters.
   *
   * @param params - An object containing the parameters for selecting terminals.
   * @param params.userID - The ID of the current user.
   * @param params.isClient - A boolean indicating if the user is a client.
   * @param params.selectedClient - (Optional) The ID of a selected client. If provided, this will be used to filter terminals.
   * @returns A promise that resolves to an array of terminals.
   *
   * @example
   * const terminals = await DashboardService.selectTerminalsForDisplay({ userID: 'user123', isClient: true });
   * console.log(terminals); // Output terminals assigned to user 'user123'.
   *
   * @example
   * const terminals = await DashboardService.selectTerminalsForDisplay({ userID: 'admin456', isClient: false, selectedClient: 'client789' });
   * console.log(terminals); // Output terminals assigned to 'client789'.
   *
   * @example
   * const terminals = await DashboardService.selectTerminalsForDisplay({ userID: 'admin456', isClient: false });
   * console.log(terminals); // Output all assigned terminals.
   */
  static async selectTerminals({
    userID,
    isClient,
    selectedClient,
  }: {
    userID: string;
    isClient: boolean;
    selectedClient?: string;
  }) {
    if (isClient) {
      return await getTerminalsByUser(userID);
    } else if (selectedClient) {
      return await getTerminalsByUser(selectedClient);
    } else {
      return await getAllAssignedTerminals();
    }
  }

  /**
   * Get the date range for the current month.
   *
   * This method returns an object containing the start and end dates of the current month.
   * The dates are formatted as ISO strings (YYYY-MM-DD).
   *
   * @returns An object with `from` and `to` properties representing the start and end dates of the current month.
   *
   * @example
   * const currentMonthRange = DashboardService.getCurrentMonthRange();
   * console.log(currentMonthRange); // { from: '2024-07-01', to: '2024-07-31' }
   */
  static getCurrentMonthRange() {
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )
      .toISOString()
      .split('T')[0];
    const lastDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    )
      .toISOString()
      .split('T')[0];

    return { from: firstDayOfMonth, to: lastDayOfMonth };
  }
}
