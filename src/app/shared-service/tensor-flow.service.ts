import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

export interface QAData {
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class TensorFlowService implements OnDestroy {
  private model: use.UniversalSentenceEncoder | null = null;
  private trainingData: QAData[] = [];
  private questionEmbeddings: tf.Tensor2D | null = null;

  // Observable to track model loading status
  private modelLoadedSubject = new BehaviorSubject<boolean>(false);
  public modelLoaded$ = this.modelLoadedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initialize();
  }

  /**
   * Initialize the service by loading model and data in parallel
   */
  private async initialize(): Promise<void> {
    try {
      // Load model and training data in parallel
      await Promise.all([
        this.loadModel(),
        this.loadTrainingData()
      ]);

      // Create embeddings once both model and data are available
      if (this.model && this.trainingData.length > 0) {
        await this.embedQuestions();
      }
    } catch (error) {
      console.error('Error initializing TensorFlow service:', error);
    }
  }

  /**
   * Load TensorFlow.js Universal Sentence Encoder
   */
  private async loadModel(): Promise<void> {
    try {
      this.model = await use.load();
      this.modelLoadedSubject.next(true);
      console.log('TensorFlow.js Model Loaded');
    } catch (error) {
      console.error('Error loading model:', error);
      this.modelLoadedSubject.next(false);
    }
  }

  /**
   * Load training data from JSON file or use a default set if file is missing
   */
  private async loadTrainingData(): Promise<void> {
    try {
      // First attempt to load from the external JSON
      this.trainingData = await firstValueFrom(
        this.http.get<QAData[]>('assets/training-data.json')
      );

      // If no data is found, use the default training data
      if (this.trainingData.length === 0) {
        console.warn('No training data found. Using default data.');
        this.trainingData = this.getDefaultTrainingData();
      }
    } catch (error) {
      console.error('Error loading training data:', error);
      // Fall back to default training data if there's an error
      this.trainingData = this.getDefaultTrainingData();
    }
  }

  /**
   * Provide a default training set if no data is available
   */
  private getDefaultTrainingData(): QAData[] {
    return [
      { question: "What is your name?", answer: "I'm your AI assistant." },
      { question: "How can I help you?", answer: "I can answer questions and assist with tasks." },
      { question: "What services do you offer?", answer: "We offer web development, mobile app development, and AI solutions." },
      { question: "What is TensorFlow?", answer: "TensorFlow is an open-source machine learning framework." },
      { question: "How do I use TensorFlow?", answer: "You can start by installing TensorFlow.js and loading a model." }
    ];
  }

  /**
   * Create embeddings for all questions in the training data
   */
  private async embedQuestions(): Promise<void> {
    if (!this.model || this.trainingData.length === 0) return;

    try {
      const questionTexts = this.trainingData.map(item => item.question);
      // First cast to unknown, then to the desired type
      const embeddings = await this.model.embed(questionTexts);
      this.questionEmbeddings = embeddings as unknown as tf.Tensor2D;
    } catch (error) {
      console.error('Error creating embeddings:', error);
    }
  }

  /**
   * Get a response based on the most similar question in the training data
   */
  public async getResponse(userInput: string): Promise<string> {
    if (!this.model || !this.questionEmbeddings || this.trainingData.length === 0) {
      return "The system is still initializing. Please try again in a moment.";
    }

    try {
      // Create embedding for user input and properly cast types
      const userInputEmbedding = await this.model.embed([userInput]);
      // First cast to unknown, then to the desired type
      const userEmbeddingTensor = userInputEmbedding as unknown as tf.Tensor2D;

      // Calculate similarity scores
      const similarityScores = this.calculateCosineSimilarity(userEmbeddingTensor);

      // Dispose of the user embedding tensor when done
      userEmbeddingTensor.dispose();

      // Find best match
      const bestMatchIndex = similarityScores.indexOf(Math.max(...similarityScores));
      return this.trainingData[bestMatchIndex]?.answer ||
        "Sorry, I couldn't find a relevant answer to your question.";
    } catch (error) {
      console.error('Error getting response:', error);
      return "An error occurred while processing your request.";
    }
  }

  /**
   * Calculate cosine similarity between user input embedding and all question embeddings
   */
  private calculateCosineSimilarity(userEmbedding: tf.Tensor2D): number[] {
    if (!this.questionEmbeddings) return [];

    return tf.tidy(() => {
      try {
        const embeddingDim = userEmbedding.shape[1];

        const userEmbeddingReshaped = userEmbedding.reshape([1, embeddingDim]);
        const questionEmbeddingsReshaped = this.questionEmbeddings!.reshape([-1, embeddingDim]);

        const userEmbeddingNorm = tf.norm(userEmbeddingReshaped, 2, 1, true);
        const questionEmbeddingsNorm = tf.norm(questionEmbeddingsReshaped, 2, 1, true);

        const normalizedUserEmbedding = tf.div(userEmbeddingReshaped, userEmbeddingNorm);
        const normalizedQuestionEmbeddings = tf.div(questionEmbeddingsReshaped, questionEmbeddingsNorm);

        const similarities = tf.matMul(normalizedUserEmbedding, normalizedQuestionEmbeddings, false, true);

        return Array.from(similarities.dataSync());
      } catch (error) {
        console.error('Error calculating cosine similarity:', error);
        return [];
      }
    });
  }

  ngOnDestroy() {
    if (this.questionEmbeddings) {
      this.questionEmbeddings.dispose();
    }
  }
}
