export const validateTask = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;
  const errors = [];

  // Title validation (Only check on POST, or on PUT if title is being updated)
  if (req.method === 'POST' || (req.method === 'PUT' && title !== undefined)) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      errors.push('Title is required and must be a string');
    } else if (title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    } else if (title.trim().length > 100) {
      errors.push('Title cannot exceed 100 characters');
    }
  }

  // Status validation
  if (status !== undefined) {
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // Priority validation
  if (priority !== undefined) {
    const validPriorities = ['Low', 'Medium', 'High'];
    if (!validPriorities.includes(priority)) {
      errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
    }
  }

  // Due Date validation
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const dateObj = new Date(dueDate);
    if (isNaN(dateObj.getTime())) {
      errors.push('Due date must be a valid date format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
