#!/bin/bash
# Script para descargar el menú actualizado desde Google Sheets

CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vTGckdo2oTuV7hgj99xBOyb4MBwSvr6PW2vrq0mo1B0RJGat7bKxWvRSFrevTQui84qwqnnWbCyLeH2/pub?gid=0&single=true&output=csv"
DEST="./menu.csv"

curl -L "$CSV_URL" -o "$DEST"
echo "Menú actualizado en $DEST"
