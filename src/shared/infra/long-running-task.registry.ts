/**
 * Contador global de tarefas longas (ex.: sync JurisWay).
 * Evita fechar o pool do Prisma durante HMR enquanto o crawler ainda roda.
 */
export class LongRunningTaskRegistry {
  private static active = 0;

  static begin(): void {
    this.active += 1;
  }

  static end(): void {
    this.active = Math.max(0, this.active - 1);
  }

  static get isActive(): boolean {
    return this.active > 0;
  }
}
