/**
 * Runs saves one at a time with latest-change-wins semantics: while a save is
 * in flight, newer values replace each other and only the newest is sent next.
 */
export class SerialSaver<T> {
  private latest: { value: T } | null = null;
  private inFlight: Promise<void> | null = null;

  constructor(private readonly run: (value: T) => Promise<void>) {}

  get busy(): boolean {
    return this.inFlight !== null;
  }

  /** Resolves once this value (or a newer one) has been saved; rejects if a save fails. */
  submit(value: T): Promise<void> {
    this.latest = { value };
    this.inFlight ??= this.drain();
    return this.inFlight;
  }

  private async drain(): Promise<void> {
    try {
      while (this.latest) {
        const { value } = this.latest;
        this.latest = null;
        await this.run(value);
      }
    } finally {
      // Runs synchronously after the last loop check, so a submit can never slip into a finished drain.
      this.inFlight = null;
    }
  }
}
