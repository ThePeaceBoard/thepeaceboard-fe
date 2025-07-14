import { PeaceData } from './PeaceDataService';

function getPeaceColor(percentage: number): string {
  if (percentage >= 70) return '#CC9F97';
  if (percentage >= 50) return '#B1C99B';
  if (percentage >= 0) return '#84889A';
  return '#27304A';
}

export class DynamicStylesheetGenerator {
  static async generateStyle(baseStyle: any, peaceData: PeaceData): Promise<any> {
    // Create a deep copy to avoid mutating the original
    const style = JSON.parse(JSON.stringify(baseStyle));
    
    // Create fill color match expression
    const fillColorExpression = ['match', ['get', 'ADM0_A3']];
    for (const [countryCode, value] of Object.entries(peaceData)) {
      fillColorExpression.push(countryCode, getPeaceColor(value));
    }
    fillColorExpression.push('#1C3B5A');

    // Create text-field match expression
    const labelExpression = ['match', ['get', 'ADM0_A3']];
    for (const [countryCode, value] of Object.entries(peaceData)) {
      labelExpression.push(countryCode, `${value}% for peace`);
    }
    labelExpression.push(['get', 'NAME']);

    // Update layers
    for (const layer of style.layers) {
      if (layer.id === 'countries-fill') {
        layer.paint['fill-color'] = fillColorExpression;
      }
      if (layer.id === 'countries-label') {
        layer.layout['text-field'] = labelExpression;
      }
    }

    return style;
  }
}
