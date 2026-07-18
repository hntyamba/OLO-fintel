import { Response } from "express";
import { db } from "../../db/client.ts";
import { AuthenticatedRequest } from "../middleware/auth.ts";

export async function createAccount(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, type, balance } = req.body;
    const { organizationId } = req.user || {};

    if (!name || !type || !organizationId) {
      return res.status(400).json({ success: false, message: "Nome e tipo de conta financeira são obrigatórios." });
    }

    const account = await db.account.create({
      data: {
        organizationId,
        name,
        type,
        balance: balance ? parseFloat(balance) : 0.0
      }
    });

    return res.status(201).json({ success: true, data: account });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao criar conta financeira." });
  }
}

export async function getAccounts(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const accounts = await db.account.findMany({
      where: { organizationId }
    });
    return res.json({ success: true, data: accounts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter contas financeiras." });
  }
}

export async function createRevenue(req: AuthenticatedRequest, res: Response) {
  try {
    const { source, amount, date, category, accountId } = req.body;
    const { organizationId } = req.user || {};

    if (!source || !amount || !date || !category || !organizationId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios em falta (origem, valor, data, categoria)." });
    }

    const value = parseFloat(amount);

    const revenue = await db.revenue.create({
      data: {
        organizationId,
        source,
        amount: value,
        date: new Date(date),
        category
      }
    });

    // If account is linked, update balance and add transaction
    if (accountId) {
      await db.account.update({
        where: { id: accountId },
        data: { balance: { increment: value } }
      }).catch(() => {});

      await db.transaction.create({
        data: {
          accountId,
          type: "IN",
          amount: value,
          reference: `Rev-${revenue.id.slice(0, 8)}`,
          date: new Date(date),
          description: source
        }
      }).catch(() => {});
    }

    return res.status(201).json({ success: true, data: revenue });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Erro ao registar receita." });
  }
}

export async function getRevenues(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const revenues = await db.revenue.findMany({
      where: { organizationId },
      orderBy: { date: "desc" }
    });
    return res.json({ success: true, data: revenues });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter receitas." });
  }
}

export async function createExpense(req: AuthenticatedRequest, res: Response) {
  try {
    const { description, amount, date, category, accountId } = req.body;
    const { organizationId } = req.user || {};

    if (!description || !amount || !date || !category || !organizationId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios em falta (descrição, valor, data, categoria)." });
    }

    const value = parseFloat(amount);

    const expense = await db.expense.create({
      data: {
        organizationId,
        description,
        amount: value,
        date: new Date(date),
        category
      }
    });

    // If account is linked, deduct balance and add transaction
    if (accountId) {
      await db.account.update({
        where: { id: accountId },
        data: { balance: { decrement: value } }
      }).catch(() => {});

      await db.transaction.create({
        data: {
          accountId,
          type: "OUT",
          amount: value,
          reference: `Exp-${expense.id.slice(0, 8)}`,
          date: new Date(date),
          description
        }
      }).catch(() => {});
    }

    return res.status(201).json({ success: true, data: expense });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao registar despesa." });
  }
}

export async function getExpenses(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};
    const expenses = await db.expense.findMany({
      where: { organizationId },
      orderBy: { date: "desc" }
    });
    return res.json({ success: true, data: expenses });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao obter despesas." });
  }
}

export async function getCashFlow(req: AuthenticatedRequest, res: Response) {
  try {
    const { organizationId } = req.user || {};

    const revenues = await db.revenue.findMany({ where: { organizationId } });
    const expenses = await db.expense.findMany({ where: { organizationId } });

    // Group by month
    const cashflowByMonth: Record<string, { month: string; inflow: number; outflow: number; balance: number }> = {};

    revenues.forEach(r => {
      const m = r.date.toISOString().slice(0, 7); // YYYY-MM
      if (!cashflowByMonth[m]) cashflowByMonth[m] = { month: m, inflow: 0, outflow: 0, balance: 0 };
      cashflowByMonth[m].inflow += r.amount;
    });

    expenses.forEach(e => {
      const m = e.date.toISOString().slice(0, 7);
      if (!cashflowByMonth[m]) cashflowByMonth[m] = { month: m, inflow: 0, outflow: 0, balance: 0 };
      cashflowByMonth[m].outflow += e.amount;
    });

    // Calculate balances
    const sortedFlows = Object.values(cashflowByMonth).sort((a, b) => a.month.localeCompare(b.month));
    sortedFlows.forEach(f => {
      f.balance = f.inflow - f.outflow;
    });

    return res.json({
      success: true,
      data: {
        summary: {
          totalInflow: revenues.reduce((sum, r) => sum + r.amount, 0),
          totalOutflow: expenses.reduce((sum, e) => sum + e.amount, 0)
        },
        monthlyTrends: sortedFlows
      }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Erro ao carregar fluxo de caixa." });
  }
}
