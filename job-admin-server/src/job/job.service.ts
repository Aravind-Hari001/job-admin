// src/job/job.service.ts
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class JobService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) { }

  async getJobs(filters: any) {
    try {
      this.pool.query(`DELETE FROM jobs WHERE deadline < NOW();`, (err, result) => {
        if (err) {
          console.error('Error deleting expired rows:', err);
        }
      })
      const { title, location_id, job_type, salary_min, salary_max } = filters;

      const conditions: string[] = [];

      if (title?.trim()) {
        conditions.push(`LOWER(title) LIKE LOWER('%${title.trim()}%')`);
      }

      if (location_id?.trim()) {
        conditions.push(`location_id = '${location_id}'`);
      }

      if (job_type?.trim()) {
        if (job_type.trim() != "All Types") {
          conditions.push(`job_type = '${job_type.trim()}'`);
        }
      }

      // if (salary_min) {
      //   conditions.push(`salary_min >= ${Number(salary_min)}`);
      // }

      if (salary_max) {
        conditions.push(`salary_max >= ${Number(salary_min)}`);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const query = `SELECT * FROM jobs ${whereClause} ORDER BY created_at DESC`;

      const result = await this.pool.query(query);

      return {
        status: true,
        data: result.rows,
        message: 'Jobs fetched successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: `Failed to fetch jobs: ${error.message}`,
      };
    }
  }

  async getMinSalary() {
    try {

      const query = `SELECT MIN(salary_max) AS salary_min, MAX(salary_max) AS salary_max FROM jobs`;
      const result = await this.pool.query(query);
      return {
        status: true,
        data: result.rows,
        message: 'Salary fetched successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: `Failed to fetch salary: ${error.message}`,
      };
    }
  }

  async createJob(job: any) {
    try {
      const {
        title, company_name, location_id,
        job_type, salary_min, salary_max, description,
        deadline,
      } = job;

      if (!title || !company_name || !location_id || !job_type) {
        return {
          status: false,
          message: 'Missing required fields',
        };
      }

      const duplicateCheckQuery = `
      SELECT id FROM jobs
      WHERE LOWER(title) = LOWER($1)
        AND LOWER(company_name) = LOWER($2)
        AND LOWER(job_type) = LOWER($3)
    `;
      const existing = await this.pool.query(duplicateCheckQuery, [title, company_name, job_type]);

      if (existing.rows.length > 0) {
        return {
          status: false,
          message: `A job titled "${title}" already exists at "${company_name}" for "${job_type}" role.`,
        };
      }

      const insertQuery = `
      INSERT INTO jobs (
        title, company_name, location_id, job_type,
        salary_min, salary_max, description, deadline
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
      const result = await this.pool.query(insertQuery, [
        title, company_name, location_id, job_type,
        salary_min, salary_max, description, deadline
      ]);

      return {
        status: true,
        data: result.rows[0],
        message: 'Job created successfully',
      };
    } catch (error) {
      return {
        status: false,
        message: `Failed to create job: ${error.message}`,
      };
    }
  }
}
