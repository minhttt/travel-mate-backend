import {
  Controller,
  // Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  ParseIntPipe,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from 'src/budget/dto/update-budget.dto';
// import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post(':tripid')
  createBudget(
    @Param('tripid', ParseIntPipe) tripid: number,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return this.budgetService.createBudget(tripid, createBudgetDto);
  }

  @Get('detail/:tripid')
  showBudget(@Param('tripid', ParseIntPipe) tripid: number) {
    return this.budgetService.showBudget(tripid);
  }

  @Patch('update/:budgetid')
  updateBudget(
    @Param('budgetid', ParseIntPipe) budgetid: number,
    @Body() updateTripChecklistDto: UpdateBudgetDto,
  ) {
    return this.budgetService.updateBudget(budgetid, updateTripChecklistDto);
  }

  @Delete('delete/:budgetid')
  deleteBudget(@Param('budgetid') budgetid: number) {
    return this.budgetService.deleteBudget(budgetid);
  }
}
