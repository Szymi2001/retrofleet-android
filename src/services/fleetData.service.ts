import { Injectable } from '@angular/core';

export interface retroCar {
  brand: string;
  model: string[];
}

export interface bodyType {
  body_type: string;
}

export interface fuelType {
  fuel_type: string;
}

export interface carColor {
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class fleetDataService {
  private retroCarBrands: retroCar[] = [
    { brand: 'Ford', model: ['Model A', 'Model T', 'Mustang'] },
    { brand: 'Chevrolet', model: ['Bel Air', 'Camaro', 'Corvette'] },
    { brand: 'Cadillac', model: ['Fleetwood', 'Eldorado', 'De Ville'] },
    { brand: 'Dodge', model: ['Dart', 'Charger', 'Viper'] },
    { brand: 'Buick', model: ['Skylark', 'Roadmaster', 'Century'] },
    { brand: 'Pontiac', model: ['Firebird', 'GTO', 'Grand Prix'] },
    { brand: 'Chrysler', model: ['Imperial', 'New Yorker', 'Newport'] },
    { brand: 'Studebaker', model: ['Commander', 'Champion', 'Avanti'] },
    { brand: 'Hudson', model: ['Hornet', 'Commodore', 'Super Six', 'Jet', 'Wasp', 'Pacemaker'] },
    { brand: 'Lincoln', model: ['Continental', 'Zephyr', 'Town Car'] },
    { brand: 'Oldsmobile', model: ['Cutlass', '88', 'Toronado'] },
    { brand: 'Plymouth', model: ['Barracuda', 'Fury', 'Road Runner'] },
    { brand: 'DeSoto', model: ['Firedome', 'Adventurer', 'Powermaster'] },
    { brand: 'Nash', model: ['Rambler', 'Metropolitan', 'Statesman'] },
    { brand: 'Kaiser', model: ['Manhattan', 'Deluxe', 'Special'] },
    { brand: 'Mercury', model: ['Cougar', 'Monterey', 'Comet'] },
    { brand: 'Edsel', model: ['Corsair', 'Pacer', 'Ranger'] },
    { brand: 'Willys', model: ['Jeep', 'Aero', 'Overland'] },
    { brand: 'AMC', model: ['Javelin', 'Matador', 'Rebel'] },
    { brand: 'Hupmobile', model: ['Roadster', 'Sedan', 'Tourer'] },
    { brand: 'Tucker', model: ['48', 'Torpedo', 'Sedan'] },
    { brand: 'Auburn', model: ['Speedster', 'Boattail', 'Cord'] },
    { brand: 'Duesenberg', model: ['SJ', 'SSJ', 'Model J'] },
    { brand: 'Crosley', model: ['Hotshot', 'Super Sport', 'Station Wagon'] },
    { brand: 'LaSalle', model: ['Series 50', 'Series 40', 'Series 52'] },
    { brand: 'Nash', model: ['Airflyte', 'Ambassador', 'Rambler'] },
    { brand: 'Stutz', model: ['Bearcat', 'Blackhawk', 'DV-32'] },
    { brand: 'Packard', model: ['Custom Eight', 'Super Eight', 'Model 120'] },
    { brand: 'Cord', model: ['810', '812', 'L-29'] },
    { brand: 'Franklin', model: ['Airman', 'Deluxe', 'Sedan'] },
    { brand: 'Graham-Paige', model: ['Spirit', 'Sharknose', 'Custom'] },
    { brand: 'Horch', model: ['853', '853A', '830BL'] },
    { brand: 'Isotta-Fraschini', model: ['8A', 'Tipo 8B', 'Tipo 8C'] },
    { brand: 'Lancia', model: ['Lambda', 'Astura', 'Augusta'] },
    { brand: 'Maybach', model: ['Zeppelin', 'SW', 'DS8'] },
    { brand: 'Stearns-Knight', model: ['Model B', 'Model C', 'Model G'] },
    { brand: 'Voisin', model: ['C14', 'C25', 'C27'] },
    { brand: 'Wanderer', model: ['W10', 'W21', 'W50'] },
    { brand: 'Delahaye', model: ['135', 'Type 165', 'Type 145'] },
    { brand: 'Hispano-Suiza', model: ['H6', 'H6B', 'J12'] },
    { brand: 'Mercedes-Benz', model: ['SSK', '500K', '540K'] },
    { brand: 'Bugatti', model: ['Type 35', 'Type 41', 'Type 57'] },
    { brand: 'Rolls-Royce', model: ['Phantom I', 'Phantom II', 'Phantom III'] },
    { brand: 'Bentley', model: ['3 Litre', '4.5 Litre', 'Speed Six'] },
    { brand: 'Aston Martin', model: ['DB5', 'DB4', 'DBR1'] },
    { brand: 'Jaguar', model: ['SS100', 'XK120', 'E-Type'] },
    { brand: 'Alfa Romeo', model: ['8C', 'Tipo 33', 'Spider'] },
  ];

  constructor() {}

  getBrandName(): retroCar[] {
    return this.retroCarBrands;
  }

  getModelForBrand(brand: string): string[] {
    const selectedBrandObj = this.retroCarBrands.find(
      (bran) => bran.brand === brand
    );
    return selectedBrandObj ? selectedBrandObj.model : [];
  }

  getBodyTypes(): bodyType[] {
    return [
      { body_type: 'Sedan' },
      { body_type: 'Kombi' },
      { body_type: 'SUV' },
      { body_type: 'Kabriolet' },
      { body_type: 'Coupe' },
    ];
  }

  getFuelTypes(): fuelType[] {
    return [
      { fuel_type: 'Benzyna' }, 
      { fuel_type: 'Diesel' },
      { fuel_type: 'Benzyna + LPG'}
    ];
  }

  getColors(): carColor[] {
    return [
      { color: 'Biały' },
      { color: 'Czarny' },
      { color: 'Czerwony' },
      { color: 'Niebieski' },
      { color: 'Zielony' },
      { color: 'Żółty' },
      { color: 'Brązowy' },
      { color: 'Beżowy' },
      { color: 'Szary' },
      { color: 'Srebrny' },
      { color: 'Złoty' },
      { color: 'Pomarańczowy' },
      { color: 'Fioletowy' },
      { color: 'Bordowy' },
      { color: 'Kremowy' },
      { color: 'Błękitny' },
      { color: 'Turkusowy' },
      { color: 'Oliwkowy' },
      { color: 'Ciemny Zielony' },
      { color: 'Ciemny Niebieski' },
      { color: 'Jasny Zielony' },
      { color: 'Jasny Niebieski' },
    ];
  }
}
