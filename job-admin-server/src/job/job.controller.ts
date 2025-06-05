import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { jobSchema } from './validation/job.schema';

@Controller()
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('jobs')
  getJobs(@Query() filters: any) {
    return this.jobService.getJobs(filters);
  }

  @Get('salary_min_max')
  getMinSalary(@Query() filters: any) {
    return this.jobService.getMinSalary();
  }

  @Post('job')
  createJob(@Body(new JoiValidationPipe(jobSchema)) job: any) {
    return this.jobService.createJob(job);
  }
}
