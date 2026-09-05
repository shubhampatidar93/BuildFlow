import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  generateProjectIdeas,
  generateProjectBlueprint,
  generateExecutionRoadmap,
  askAiMentor
} from './server/geminiService';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      product: 'BUILDflow AI',
      tagline: 'From Idea to Execution.',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Generate personalized project ideas
  app.post('/api/ai/generate-ideas', async (req, res) => {
    try {
      const { profile, customPrompt } = req.body;
      const ideas = await generateProjectIdeas(profile || {}, customPrompt);
      res.json({ success: true, ideas });
    } catch (error: any) {
      console.error('Error generating project ideas:', error);
      res.status(500).json({ success: false, error: error?.message || 'Failed to generate ideas' });
    }
  });

  // 3. Generate architectural blueprint
  app.post('/api/ai/generate-blueprint', async (req, res) => {
    try {
      const { project, profile } = req.body;
      if (!project) {
        return res.status(400).json({ success: false, error: 'Project data required' });
      }
      const blueprint = await generateProjectBlueprint(project, profile);
      res.json({ success: true, blueprint });
    } catch (error: any) {
      console.error('Error generating blueprint:', error);
      res.status(500).json({ success: false, error: error?.message || 'Failed to generate blueprint' });
    }
  });

  // 4. Generate step-by-step roadmap & tasks
  app.post('/api/ai/generate-roadmap', async (req, res) => {
    try {
      const { title, blueprint, timeline } = req.body;
      const roadmap = await generateExecutionRoadmap(
        title || 'Engineering Capstone',
        blueprint,
        timeline || '2 months'
      );
      res.json({ success: true, ...roadmap });
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      res.status(500).json({ success: false, error: error?.message || 'Failed to generate roadmap' });
    }
  });

  // 5. AI Mentor conversation with project context
  app.post('/api/ai/mentor', async (req, res) => {
    try {
      const { question, project, blueprint, phases, tasks, currentTask, profile } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, error: 'Question required' });
      }
      const response = await askAiMentor({
        question,
        project: project || {},
        blueprint,
        phases: phases || [],
        tasks: tasks || [],
        currentTask: currentTask || null,
        profile: profile || {},
      });
      res.json({ success: true, ...response });
    } catch (error: any) {
      console.error('Error querying AI mentor:', error);
      res.status(500).json({ success: false, error: error?.message || 'Failed to consult AI mentor' });
    }
  });

  // 6. Next Best Task Recommendation Engine
  app.post('/api/ai/next-task', async (req, res) => {
    try {
      const { tasks, currentPhase } = req.body;
      if (!Array.isArray(tasks) || tasks.length === 0) {
        return res.json({ success: true, recommendedTask: null });
      }

      // Priority 1: Any IN PROGRESS task
      let target = tasks.find((t: any) => t.status === 'IN PROGRESS');

      // Priority 2: NOT STARTED task in current phase
      if (!target && currentPhase) {
        target = tasks.find((t: any) => t.status === 'NOT STARTED' && t.phase === currentPhase);
      }

      // Priority 3: First NOT STARTED task
      if (!target) {
        target = tasks.find((t: any) => t.status === 'NOT STARTED');
      }

      // Fallback: first task
      if (!target) {
        target = tasks[0];
      }

      const completedCount = tasks.filter((t: any) => t.status === 'COMPLETED').length;
      const reasoning = completedCount === 0
        ? 'Kickstart your project with foundational setup to unblock downstream development.'
        : `You have completed ${completedCount} prerequisite milestones. Tackling "${target.title}" advances your current phase deliverable directly.`;

      res.json({
        success: true,
        recommendedTask: target,
        reasoning,
      });
    } catch (error: any) {
      console.error('Error calculating next task:', error);
      res.status(500).json({ success: false, error: error?.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BUILDflow AI] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
