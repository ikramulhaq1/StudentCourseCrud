using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentcoursecrud.Models;

namespace studentcoursecrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly StudentCourseCrudContext _context;

        public StudentsController(StudentCourseCrudContext context)
        {
            _context = context;
        }

        // GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students
                .Include(s => s.Studentcourses)
                .ToListAsync();
        }

        // GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

        // PUT: api/Students/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, Student student)
        {
            if (id != student.Id)
            {
                return BadRequest();
            }

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Students
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = student.Id }, student);
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.Id == id);
        }
        //uses Linq For swagger to get student and related courses data without bridge table class
        //[HttpGet("GetStudentCoursesData")]
        //public async Task<Student?> GetStudentCoursesData(int id)
        //{
        //    return await _context.Students
        //        .Include(s => s.Studentcourses)
        //        .Where(s => s.Id == id)
        //        .FirstOrDefaultAsync();
        //}

        [HttpGet]
        public ActionResult<object> GetStudentsWithCourses()
        {
            var std = _context.Students
                .Include(s => s.Studentcourses)
                .ThenInclude(b => b.Course)
                .Where(s => s.Id == s.Id)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.FatherName,
                    s.Address,
                    Course = s.Studentcourses.
                    Select(b => b.Course.Name)
                })
                .ToList();
            if(std == null)
            {
                return NotFound();
            }
            else
            {
                return std;
            }
        }
    }
}
