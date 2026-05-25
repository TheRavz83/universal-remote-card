import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant } from '../models/interfaces/HomeAssistant';

@customElement('urc-source-menu')
export class UrcSourceMenu extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: String }) public entity: string = '';
  @property({ type: Boolean }) public icon: boolean = false;

  @state() private isOpen = false;
  @state() private sources: string[] = [];
  @state() private currentSource = '';

  connectedCallback() {
    super.connectedCallback();
    this._onOutside = this._onOutside.bind(this);
    document.addEventListener('click', this._onOutside);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onOutside);
    super.disconnectedCallback();
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has('hass') || changed.has('entity')) {
      this._updateFromHass();
    }
  }

  private _updateFromHass() {
    if (!this.hass || !this.entity) return;
    const stateObj = this.hass.states[this.entity];
    if (!stateObj) return;
    const attrs = stateObj.attributes as any;
    // support different attribute names
    this.sources = (attrs.source_list || attrs.sources || []) as string[];
    this.currentSource = (attrs.source || stateObj.state || '') as string;
  }

  private async _selectSource(source: string) {
    if (!this.hass || !this.entity) return;
    this.isOpen = false;
    try {
      await this.hass.callService('media_player', 'select_source', {
        entity_id: this.entity,
        source,
      });
      this.currentSource = source;
    } catch (e) {
      console.error('Failed to select source', e);
    }
  }

  private _onOutside(e: Event) {
    if (!this.isOpen) return;
    const path = (e as any).composedPath ? (e as any).composedPath() : [];
    if (!path.includes(this)) this.isOpen = false;
  }

  private _toggle() {
    this.isOpen = !this.isOpen;
  }

  render() {
    return html`
      <div class="urc-dropdown" @click=${(e: Event) => e.stopPropagation()} ?open=${this.isOpen}>
        <button class="urc-button" @click=${this._toggle}>
          <span class="label">${this.currentSource || 'Sources'}</span>
          <span class="caret">▾</span>
        </button>
        <div class="urc-menu" ?open=${this.isOpen}>
          ${this.sources.map(
            (s) => html`<button class="urc-item" @click=${() => this._selectSource(s)} ?selected=${s === this.currentSource}>${s}</button>`,
          )}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host { display: inline-block; }
    .urc-dropdown {
      position: relative;
      display: inline-flex;
      width: auto;
      min-width: 120px;
    }
    .urc-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: auto;
      min-width: 120px;
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.02);
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
    }
    .urc-menu {
      position: absolute;
      left: 0;
      top: calc(100% + 6px);
      min-width: max-content;
      width: auto;
      max-width: 320px;
      display: grid;
      grid-auto-rows: min-content;
      gap: 4px;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.25));
      border-radius: 8px;
      padding: 6px;
      display: none;
      z-index: 1000;
    }
    .urc-menu[open] { display: grid; }
    .urc-item {
      display: block;
      width: 100%;
      background: transparent;
      border: 0;
      text-align: left;
      padding: 8px 10px;
      border-radius: 6px;
      cursor: pointer;
      white-space: normal;
    }
    .urc-item[selected], .urc-item:hover { background: rgba(127,127,127,0.12); }
  `;
}
