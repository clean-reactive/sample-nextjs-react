import {
  createContainer,
  createModule,
  type Container,
  type Module,
} from '@evyweb/ioctopus';

import { registerApplicationModules } from '@/di/container';
import { DI_RETURN_TYPES, DI_SYMBOLS } from '@/di/types';

export class TestBed {
  static make() {
    const container = createContainer();
    registerApplicationModules(container);
    return new TestBed(container);
  }

  private readonly testModule: Module;

  private constructor(private readonly container: Container) {
    this.testModule = createModule();
    this.container.load(Symbol('TestOverridesModule'), this.testModule);
  }

  override<K extends keyof typeof DI_SYMBOLS>(
    symbol: K,
    value: DI_RETURN_TYPES[K]
  ): void {
    this.testModule.bind(DI_SYMBOLS[symbol]).toValue(value);
  }

  inject<K extends keyof typeof DI_SYMBOLS>(symbol: K): DI_RETURN_TYPES[K] {
    return this.container.get(DI_SYMBOLS[symbol]);
  }
}
