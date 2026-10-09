#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

QUIET=false
for arg in "$@"; do
    case $arg in
        --quiet) QUIET=true; shift ;;
    esac
done

log() { [[ "$QUIET" == false ]] && echo -e "$@"; return 0; }

# Configuration
SOURCE_DIR="$(pwd)"
PLUGIN_SLUG="wp-payment-form"
BUILDS_DIR="$(pwd)/builds"
OUTPUT_FILE="$BUILDS_DIR/${PLUGIN_SLUG}.zip"

mkdir -p "$BUILDS_DIR"

log "${BLUE}📦 Creating ZIP archive...${NC}"

# Files and folders to INCLUDE (whitelist approach)
INCLUDE_ITEMS=(
    "app"
    "assets"
    "boot"
    "config"
    "database"
    "language"
    "vendor"
    "wp-payment-form.php"
    "readme.txt"
    "composer.json"
    "LICENSE"
    "index.php"
)

# Remove existing zip file
[[ -f "$OUTPUT_FILE" ]] && rm "$OUTPUT_FILE"

log "${YELLOW}📁 Preparing files...${NC}"

# Get parent directory and folder name for proper WordPress zip structure
PARENT_DIR="$(dirname "$SOURCE_DIR")"
FOLDER_NAME="$(basename "$SOURCE_DIR")"

# Build the include list with folder prefix
INCLUDE_PATHS=()
for item in "${INCLUDE_ITEMS[@]}"; do
    INCLUDE_PATHS+=("${FOLDER_NAME}/${item}")
done

# Exclusion patterns for files within included folders
EXCLUDE_ARGS=()
EXCLUDE_ARGS+=("-x" "*.DS_Store")
EXCLUDE_ARGS+=("-x" "*/.DS_Store")
EXCLUDE_ARGS+=("-x" "*.git*")

# Count files to be zipped
cd "$PARENT_DIR"
TOTAL_FILES=$(find "${INCLUDE_PATHS[@]}" -type f 2>/dev/null | wc -l | tr -d ' ')

if [[ "$TOTAL_FILES" -eq 0 ]]; then
    echo -e "${RED}❌ No files found to zip!${NC}"
    exit 1
fi

log "${BLUE}📊 Found approximately $TOTAL_FILES files to zip${NC}"

# Progress bar function
show_progress() {
    local current=$1
    local total=$2
    local width=50
    (( total == 0 )) && total=1
    local percentage=$(( current * 100 / total ))
    local completed=$(( current * width / total ))
    local remaining=$(( width - completed ))

    local bar=""
    if [[ "$current" -eq "$total" ]]; then
        bar=$(printf '█%.0s' $(seq 1 $width))
    else
        bar=$(printf '█%.0s' $(seq 1 $completed))
        bar+=$(printf '░%.0s' $(seq 1 $remaining))
    fi

    printf "\r${BLUE}📦 Zipping [${NC}%s${BLUE}] %3d%% (${current}/${total})${NC}" "$bar" "$percentage"
}

log "${BLUE}📦 Creating ZIP archive...${NC}"
count=0

if [[ "$QUIET" == true ]]; then
    zip -r9 "$OUTPUT_FILE" "${INCLUDE_PATHS[@]}" "${EXCLUDE_ARGS[@]}" > /dev/null
else
    zip -r9 "$OUTPUT_FILE" "${INCLUDE_PATHS[@]}" "${EXCLUDE_ARGS[@]}" | while read -r line; do
        ((count++))
        show_progress "$count" "$TOTAL_FILES"
    done
    show_progress "$TOTAL_FILES" "$TOTAL_FILES"
    echo ""
fi

cd "$SOURCE_DIR"

if [[ -f "$OUTPUT_FILE" ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        FILE_SIZE=$(stat -f%z "$OUTPUT_FILE")
    else
        FILE_SIZE=$(stat -c%s "$OUTPUT_FILE")
    fi
    FILE_SIZE_MB=$(echo "scale=2; $FILE_SIZE / 1024 / 1024" | bc)

    log "${BLUE}📋 Included:${NC}"
    if [[ "$QUIET" == false ]]; then
        for item in "${INCLUDE_ITEMS[@]}"; do
            echo -e "   ${item}"
        done
    fi

    log "${GREEN}✅ ZIP file created: $OUTPUT_FILE${NC}"
    log "${GREEN}📏 Plugin size: ${FILE_SIZE_MB} MB${NC}"
else
    echo -e "${RED}❌ Failed to create ZIP file${NC}"
    exit 1
fi
