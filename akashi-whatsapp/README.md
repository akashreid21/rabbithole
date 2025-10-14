# Akashi WhatsApp - Task Management System

A WhatsApp-based task management system that automatically extracts action items from your WhatsApp Business conversations with candidates.

## Features

- **WhatsApp Integration**: Connects to your WhatsApp Business account
- **Automatic Task Detection**: Uses keyword matching to identify action items from messages
- **Task Categories**:
  - Scheduling (interviews, meetings, appointments)
  - Follow-ups (status checks, updates)
  - Status Updates (feedback, results)
  - General inquiries
- **Priority Levels**: High, Medium, Low (automatically assigned)
- **Task Management**: Mark tasks as new, in-progress, or completed
- **Real-time Dashboard**: View all tasks with filtering and stats
- **Mobile Responsive**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **WhatsApp Integration**: whatsapp-web.js
- **Deployment**: Ready for Vercel/Netlify

## Prerequisites

- Node.js 18+ installed
- WhatsApp Business account
- Phone with WhatsApp installed (for QR code scanning)

## Installation

1. Navigate to the project directory:
```bash
cd akashi-whatsapp
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and go to: `http://localhost:3000`

3. Click "Connect WhatsApp" button in the dashboard

4. **IMPORTANT**: Check your terminal/console - you'll see a QR code URL or text

5. Scan the QR code with your WhatsApp Business app:
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices
   - Tap "Link a Device"
   - Scan the QR code shown in your terminal

6. Once connected, the dashboard will show "Connected" status

7. Start receiving messages - the system will automatically detect action items and create tasks!

## How It Works

### Task Detection

The system analyzes incoming WhatsApp messages for:

**Scheduling Keywords**: schedule, interview, meeting, appointment, slot, available, when can, time, date, reschedule

**Follow-up Keywords**: follow up, update, status, any news, heard back, progress, waiting, pending, check

**Status Update Keywords**: result, outcome, feedback, decision, next step, what happened, how did, passed, failed

When a message contains these keywords OR a question mark (?), it's flagged as a potential action item.

### Task Management

From the dashboard, you can:
- View all tasks with stats (Total, New, In Progress, Completed)
- Filter tasks by status
- Mark tasks as "In Progress" or "Completed"
- Delete tasks
- See candidate details and original messages

## Project Structure

```
akashi-whatsapp/
├── app/
│   ├── api/
│   │   ├── tasks/           # Task management APIs
│   │   └── whatsapp/        # WhatsApp connection APIs
│   └── page.tsx             # Main dashboard UI
├── services/
│   ├── whatsappService.ts   # WhatsApp client & connection
│   └── taskExtractor.ts     # Task extraction logic
├── types/
│   └── task.ts              # TypeScript types
└── README.md
```

## Important Notes

### For Development/Testing (Current Setup)

- Uses `whatsapp-web.js` (unofficial library)
- Free to use
- Runs on your local machine
- ⚠️ Against WhatsApp ToS - use for testing only
- May get banned if used heavily in production

### For Production (Future)

Consider upgrading to:
1. **WhatsApp Business API** (Official)
   - Requires business verification
   - More reliable and compliant
   - Better for production use

2. **Twilio WhatsApp API**
   - Easy integration
   - Pay-per-message pricing
   - Good documentation

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Deploy

**Note**: WhatsApp connection requires a long-running process. For production, you'll need:
- A separate backend server (not serverless)
- Or use WhatsApp Business API Cloud

### Deploy to Netlify

Similar to Vercel, but note the same limitations about long-running processes.

## Troubleshooting

### QR Code Not Showing
- Check your terminal/console output
- Make sure development server is running (`npm run dev`)
- Try refreshing the page and clicking "Connect WhatsApp" again

### Not Detecting Tasks
- Make sure messages contain action keywords or question marks
- Check that WhatsApp is connected (green indicator)
- Look at browser console for errors
- Check the taskExtractor keywords in `services/taskExtractor.ts`

### Connection Lost
- QR codes expire after ~1 minute
- WhatsApp Web sessions can timeout
- Simply reconnect by clicking "Connect WhatsApp" again

## Future Enhancements

- [ ] Add AI/NLP for better task detection (OpenAI, Anthropic)
- [ ] Implement persistent database (PostgreSQL, MongoDB)
- [ ] Add user authentication
- [ ] Send replies directly from dashboard
- [ ] Add notification system
- [ ] Export tasks to CSV/Excel
- [ ] Add task search functionality
- [ ] Integrate with calendar apps
- [ ] Add multi-user support

## Support

For issues or questions, check the console logs and ensure:
1. WhatsApp is properly connected
2. All dependencies are installed
3. Node.js version is 18 or higher

## License

This is a prototype/MVP project for personal use.

---

Built with ❤️ for Talent Acquisition professionals
