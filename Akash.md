# Project Specification

## 1. Background & Problem
**What's the problem?** Currently i am having trouble to extract information from a whatsapp chats that automatically create a task for me.

**Who has this problem?** Talent acquisition.

**Current situation:** If i dont have this solution i may missed the pending actions from a candidate or that needs to be done. Example scheduling an interview slot, following up for an assessment, updating an interview status when candidate ask. This will create a bad impression towards our company brand if i didnt respond.

## 2. Goals & Success Metrics
**Primary Goal:** Main objective is to make sure all the task required my attention is listed on a platform/tools for me to execute.

**Success looks like:**
I am able to clear up my pending task that comes in a form of question or inquiry from whatsapp

## 3. Project Overview
**Project Name:** Akashi Whatsapp Project

**Target Users:** Me myself who works as a talent acquisition.

## 4. What It Should Do
### Backend Components
**WhatsApp Integration Service**
Feature 1: Connects to WhatsApp API/Business API
Feature 2: Monitors incoming messages 24/7
Feature 3: Hosted on cloud server (independent of local device)

**Natural Language Processing (NLP) Engine**
Feature 1: Analyzes messages to identify action items/inquiries
Feature 2: Categorizes tasks by urgency/type (scheduling, follow-up, status update)
Feature 3: Uses machine learning to improve detection accuracy over time

**Task Management Database**
Stores extracted tasks with metadata
Maintains task status (pending/completed)
Links back to original WhatsApp conversation

### User Flow
**Setup Phase**
   - Connect WhatsApp account
   - Train system with example tasks/inquiries
   - Set working hours/response times

**Daily Usage**
   - Log in to dashboard
   - View prioritized task list
   - Click on tasks to see details
   - Respond directly or mark as completed
   - Filter/sort as needed

**Automation**
   - System runs continuously on cloud
   - New tasks appear in real-time
   - Optional notifications for urgent items

## Mobile Responsiveness
- Fully responsive design
- Native mobile app option for on-the-go task management

## 5. How It Should Look
**Visual Style:** Modern, sleek and minimalist

**Layout:** 
**Header**
Project name "Akashi WhatsApp"
User profile/settings
Notification bell

**Task Overview Panel**
Total tasks counter
Tasks by status (new, in-progress, completed)
Tasks by category visual

**Task List (Main Content)**
Sortable columns (date, priority, candidate, task type)
Task cards showing:
Candidate name/contact
Extracted task description
Original message preview
Timestamp
Priority indicator
Action buttons (complete, snooze, open chat)
Infinite scroll or pagination
Filter options (by date, status, candidate)

**Quick Actions Sidebar**
  - Mark all as read
  - Bulk complete
  - Export tasks
  - System status indicator

#### Task Detail View
- Task description
- Full conversation context
- Response options
- History of interactions
- Related tasks from same candidate

## 6. Technical Requirements
**Deployment:** Netlify or Vercel (choose one or let AI recommend)

**Works on:** Both computers and mobile phones

**Data Storage:** Save user's tasks even after closing browser
