import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './clima.component.html'
})
export class ClimaComponent {
  ciudad: string = '';
  clima: any = null;
  error: string = '';
  apiKey: string = 'a45a7a65f00474c3b2a857740f3c08f3';
  chart: any = null;
  historial: any[] = [];

  constructor(private http: HttpClient) {}

  buscarClima() {
    this.error = '';
    this.clima = null;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.ciudad}&appid=${this.apiKey}&units=metric&lang=es`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.clima = data;
        if (!this.historial.find((c: any) => c.name === data.name)) {
          this.historial.unshift(data);
        }
        setTimeout(() => this.crearGrafico(), 100);
      },
      error: () => this.error = 'Ciudad no encontrada. Inténtalo de nuevo.'
    });
  }

  crearGrafico() {
    if (this.chart) this.chart.destroy();
    const canvas = document.getElementById('climaChart') as HTMLCanvasElement;
    if (!canvas) return;
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Temperatura', 'M\u00ednima', 'M\u00e1xima', 'Sensaci\u00f3n t\u00e9rmica'],
        datasets: [{
          label: `Temperatura en ${this.clima.name} (\u00b0C)`,
          data: [
            this.clima.main.temp,
            this.clima.main.temp_min,
            this.clima.main.temp_max,
            this.clima.main.feels_like
          ],
          backgroundColor: ['#0d6efd', '#0dcaf0', '#dc3545', '#ffc107']
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: false } }
      }
    });
  }
}