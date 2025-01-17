import { RenderChildNodes } from '../createRenderChildNodes'
import { Translations } from '../i18n/fi-FI'

export type QuestionId = number

interface AnswerCommon {
  questionId: QuestionId
  value: string
}
export interface TextAnswer extends AnswerCommon {
  type: 'text'
  characterCount: number
}
export interface RichTextAnswer extends AnswerCommon {
  type: 'richText'
  characterCount: number
}
export interface ChoiceAnswer extends AnswerCommon {
  type: 'choice'
}
export type ExamAnswer = TextAnswer | RichTextAnswer | ChoiceAnswer

/**
 * CAS status is a state machine with three states.
 *
 * ```
 * +---------+       +--------+      +-------+
 * |forbidden| <---> |allowing| ---> |allowed|
 * +---------+       +--------+      +-------+
 * ```
 *
 * When the user clicks the "Palauta A-osa" button, we start a 60s countdown
 * and transition the state from `'forbidden'` to `'allowing'`. When the timer reaches
 * zero, we transition the state from from `'allowing'` to `'allowed'`. Cancelling
 * the countdown transitions the state back from `'allowing'` to `'forbidden'`.
 */
export type CasStatus = InitialCasStatus | 'allowing'
export type InitialCasStatus = 'allowed' | 'forbidden'
export type RestrictedAudioId = number
export type AudioPlaybackError =
  /** The user has already accessed this restricted audio */
  | 'already-accessed'
  /** There already is an audio file playing */
  | 'already-playing'
  /** Other error, e.g. a network issue */
  | 'other-error'
export type AudioPlaybackResponse = 'ok' | AudioPlaybackError

export interface RestrictedAudioPlaybackStats {
  /** An unique identifier for each restricted audio element */
  restrictedAudioId: RestrictedAudioId
  /** Number of times it has been listened to. */
  times: number
}

export interface ExamComponentProps {
  className?: string
  /** An element in the exam XML. */
  element: Element
  /** A function that knows how to render the child nodes of this element. */
  renderChildNodes: RenderChildNodes
}

export interface ExamServerAPI {
  /**
   * Setting CAS status to allowed will lock the answers for each section where
   * the use of CAS software is forbidden.
   *
   * All state transitions are not legal (for example, you may not disable CAS
   * software after they have been allowed), so the function returns the CAS
   * status that the server decided upon.
   */
  setCasStatus: (casStatus: CasStatus) => Promise<CasStatus>
  /** Retrieve the latest answer for each question */
  getAnswers: () => Promise<ExamAnswer[]>
  /** Save a new answer to the server */
  saveAnswer: (answer: ExamAnswer) => Promise<void>
  /**
   * Play a non-restricted audio file. Right now, this is only used by the
   * audio test. The Promise should be resolved with `'ok'` when playback starts
   * or with an error response if an error occurs.
   */
  playAudio: (src: string) => Promise<AudioPlaybackResponse>
  /**
   * Play a restricted audio file. The promise should be resolved with `'ok'`
   * when the playback starts or with an error response if an error occurs.
   *
   * @param restrictedAudioId A number that uniquely identifies each restricted audio element.
   * @param playbackTimes How many times this audio has been listened to already.
   */
  playRestrictedAudio: (src: string, restrictedAudioId: number, playbackTimes: number) => Promise<AudioPlaybackResponse>
  /** Select another answer version from answer history. Return undefined to cancel. Optional feature. */
  selectAnswerVersion?: (questionId: QuestionId, questionTitle: string) => Promise<ExamAnswer | undefined>
  /** Save screenshot to server. Should return the URL to the saved screenshot. */
  saveScreenshot: (questionId: QuestionId, screenshot: Blob) => Promise<string>
}

export interface AnswerError {
  key: keyof Translations['answer-errors']
  options?: object
}
