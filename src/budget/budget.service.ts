import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
// import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from 'src/budget/entities/budget.entity';
import { UpdateBudgetDto } from 'src/budget/dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
  ) {}
  async createBudget(
    tripid: number,
    createBudgetDto: CreateBudgetDto,
  ): Promise<any> {
    const budget: Budget = new Budget();
    budget.tripid = tripid;
    budget.payfor = createBudgetDto.payfor;
    budget.amount = createBudgetDto.amount;
    const savedBudget = await this.budgetRepo.save(budget);
    return {
      tripid: savedBudget.tripid,
      payfor: savedBudget.payfor,
      amount: savedBudget.amount,
    };
  }

  async showBudget(
    tripid: number,
  ): Promise<{ totalAmount: number; budgets: Budget[] }> {
    const budgets = await this.budgetRepo.findBy({ tripid });
    const totalAmount = budgets.reduce((sum, item) => sum + item.amount, 0);
    return {
      totalAmount,
      budgets,
    };
  }

  async updateBudget(
    budgetId: number,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<UpdateBudgetDto> {
    const budget = await this.budgetRepo.findOneBy({ tripbudgetid: budgetId });
    if (!budget) {
      throw new NotFoundException(`Budget with id ${budgetId} not found`);
    }

    if (updateBudgetDto.payfor !== undefined) {
      budget.payfor = updateBudgetDto.payfor;
    }

    if (updateBudgetDto.amount !== undefined) {
      budget.amount = updateBudgetDto.amount;
    }

    await this.budgetRepo.save(budget);

    return {
      payfor: budget.payfor,
      amount: budget.amount,
    };
  }

  async deleteBudget(budgetId: number) {
    await this.budgetRepo.delete(budgetId);
    return { success: true };
  }
}
