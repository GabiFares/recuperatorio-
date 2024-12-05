import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core'; // Importa las funciones necesarias de Angular
import { View, Map, Feature } from 'ol'; // Importa las clases View, Map y Feature de OpenLayers
import TileLayer from 'ol/layer/Tile'; // Importa TileLayer de OpenLayers para crear una capa de mosaico
import OSM from 'ol/source/OSM'; // Importa OSM de OpenLayers como fuente de mosaico
import { fromLonLat } from 'ol/proj'; // Importa fromLonLat de OpenLayers para convertir coordenadas
import { Point, Polygon } from 'ol/geom'; // Importa las geometrías Point y Polygon de OpenLayers
import VectorLayer from 'ol/layer/Vector'; // Importa VectorLayer de OpenLayers para crear una capa vectorial
import VectorSource from 'ol/source/Vector'; // Importa VectorSource de OpenLayers para la fuente de datos vectoriales
import { Style, Icon, Fill, Stroke } from 'ol/style'; // Importa las clases de estilo de OpenLayers
import { Punto } from '../../interfaces/punto'; // Importa la interfaz Punto

@Component({
  selector: 'app-mapa', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  templateUrl: './mapa.component.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  styleUrls: ['./mapa.component.scss'], // Especifica la ubicación del archivo de estilos CSS del componente
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef; // Accede al contenedor del mapa en la plantilla

  map!: Map; // Define una propiedad para almacenar la instancia del mapa
  vectorSource: VectorSource; // Define una propiedad para la fuente vectorial

  // Define un array de puntos con coordenadas de Salto, Uruguay
  puntos: Punto[] = [
    { latitud: -31.390312485072155, longitud: -57.95325964113459 }, // Coordenadas de Salto, Uruguay
  ];

  constructor() {
    this.vectorSource = new VectorSource(); // Inicializa la fuente vectorial
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeMap();

      // Deshabilitar la interacción del mapa inicialmente
      this.map.getInteractions().forEach((interaction) => {
        interaction.setActive(false);
      });

      // Habilitar la interacción del mapa al hacer clic
      this.mapContainer.nativeElement.addEventListener('pointerdown', () => {
        this.map.getInteractions().forEach((interaction) => {
          interaction.setActive(true);
        });
      });
    }, 100);
  }

  // Método para inicializar el mapa
  private initializeMap(): void {
    const tileLayer = new TileLayer({
      source: new OSM({
        attributions: [
          'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ],
        maxZoom: 19, // Limita el zoom máximo para mejorar el rendimiento
      }),
    });

    const view = new View({
      center: fromLonLat([-57.95325964113459, -31.390312485072155]), // Establece las coordenadas centrales del mapa en Salto, Uruguay
      zoom: 13,
      minZoom: 10, // Establece un zoom mínimo para evitar errores al hacer zoom hacia atrás
      maxZoom: 19, // Establece un zoom máximo para evitar errores al hacer zoom hacia adelante
    });

    const vectorLayer = new VectorLayer({
      source: this.vectorSource, // Asigna la fuente vectorial al vectorLayer
    });

    this.map = new Map({
      target: this.mapContainer.nativeElement, // Establece el contenedor del mapa como objetivo
      layers: [tileLayer, vectorLayer], // Agrega capas al mapa
      view: view, // Establece la vista del mapa
    });

    // Agrega puntos al mapa a partir de las coordenadas definidas en `puntos`
    for (let punto of this.puntos) {
      this.addPointGeometry([punto.longitud, punto.latitud]);
    }

    // Agregar el polígono naranja
    this.addPolygon(
      [
        [-57.97550899831761, -31.380028381241935],
        [-57.9453102781731, -31.38471583245588],
        [-57.94707846209528, -31.397664693595804],
        [-57.971181600823876, -31.394884413842583],
      ],
      'rgba(255, 165, 0, 0.5)', // Color del polígono naranja
    );

    // Agregar el polígono rojo
    this.addPolygon(
      [
        [-57.968249473316, -31.38111999541515],
        [-57.9653936824279, -31.367115299170482],
        [-57.958126285069525, -31.367751734441306],
        [-57.96045557909463, -31.38246809780064],
      ],
      'rgba(255, 0, 0, 0.5)', // Zona Roja
    );

    // Agregar el polígono amarillo
    this.addPolygon(
      [
        [-57.96037595879556, -31.382557522559512],
        [-57.958049770091165, -31.367662173802554],
        [-57.94303527936283, -31.369016393992037],
        [-57.94546720391743, -31.384723922012174],
      ],
      'rgba(255, 255, 0, 0.5)', // Zona Amarilla
    );

    // Agregar el polígono verde
    this.addPolygon(
      [
        [-57.945478925715356, -31.38469232627015],
        [-57.94694911199587, -31.398183502144903],
        [-57.9423924586468, -31.39832828463678],
        [-57.93129506016257, -31.38674353498477],
      ],
      'rgba(0, 128, 0, 0.5)', // Zona Verde
    );

    // Agregar el polígono púrpura
    this.addPolygon(
      [
        [-57.94502365371021, -31.384625995628486],
        [-57.94299125893172, -31.36900937156826],
        [-57.92025384234736, -31.370961591529145],
        [-57.93266582804703, -31.386616559214893],
      ],
      'rgba(128, 0, 128, 0.5)', // Zona Púrpura
    );

    // Agregar el polígono celeste
    this.addPolygon(
      [
        [-57.94710758474122, -31.397918557300628],
        [-57.94864005886628, -31.4094950417914],
        [-57.97036159621069, -31.406169363389846],
        [-57.96828893043355, -31.39541317100849],
      ],
      'rgba(0, 255, 255, 0.5)', // Zona Celeste
    );

    // Agregar el polígono amarillo oscuro
    this.addPolygon(
      [
        [-57.970574142574215, -31.406186141849876],
        [-57.968120798945364, -31.395425126139305],
        [-57.98004677491895, -31.394029012077045],
        [-57.98202307950886, -31.399497006902088],
        [-57.98597568868868, -31.40403403740667],
      ],
      'rgba(255, 140, 0, 0.5)', // Zona Amarillo Oscuro
    );

    // Agregar el polígono azul oscuro
    this.addPolygon(
      [
        [-57.968449922179154, -31.380825654969502],
        [-57.976379355633476, -31.379246078538753],
        [-57.97417673522206, -31.36570576252924],
        [-57.96563056805463, -31.366984653580403],
      ],
      'rgba(0, 0, 139, 0.5)', // Zona Azul Oscuro
    );

    // Agregar el polígono verde oscuro
    this.addPolygon(
      [
        [-57.971445485898805, -31.394890235821315],
        [-57.979374919353134, -31.393536517544916],
        [-57.975281485925386, -31.381147499381907],
      ],
      'rgba(0, 100, 0, 0.5)', // Zona Verde Oscuro
    );

    // Agregar el polígono púrpura oscuro
    this.addPolygon(
      [
        [-57.94875839992161, -31.40946333665301],
        [-57.949172421141085, -31.41544153394981],
        [-57.98726894457928, -31.409358452575972],
        [-57.98591713246281, -31.40411410038103],
      ],
      'rgba(128, 0, 128, 0.5)', // Zona Púrpura Oscuro
    );

    //Agregar el polígono rosa
    this.addPolygon(
      [
        [-57.98620591196032, -31.403900970283683],
        [-57.990539359065465, -31.40110437819596],
        [-57.98583598354131, -31.397044660715448],
        [-57.980815526529234, -31.394563635854478],
        [-57.98213669942716, -31.39948051224258],
      ],
      'rgba(255, 182, 193, 0.5)', // Zona Rosa
    );
  }

  // Agrega un punto/s al mapa
  private addPointGeometry(coordinates: [number, number]): void {
    const pointFeature = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });

    pointFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png',
        }),
      }),
    );

    this.vectorSource.addFeature(pointFeature);
  }

  // Agrega un polígono al mapa
  private addPolygon(coordinates: [number, number][], color: string): void {
    const polygonFeature = new Feature({
      geometry: new Polygon([coordinates.map((coord) => fromLonLat(coord))]),
    });

    polygonFeature.setStyle(
      new Style({
        fill: new Fill({
          color: color,
        }),
        stroke: new Stroke({
          color: '#000',
          width: 2,
        }),
      }),
    );

    this.vectorSource.addFeature(polygonFeature);
  }
}
