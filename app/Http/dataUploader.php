<?php

namespace App\Http;

use Carbon\Carbon;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\MessageBag;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Individuals;
use App\Models\Households;

class DataUploader extends BaseController
{

    public $uploadFileName;
    protected function setUploadFileName()
    {
        $this->uploadFileName  = 'data_file';
    }

    public $uploadSuccessMessage;
    protected function setUploadSuccessMessage()
    {
        $this->uploadSuccessMessage  = 'File has been uploaded.';
    }

    protected Request $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->setUploadFileName();
        $this->setUploadSuccessMessage();
    }

    public function handleUploadedFile()
    {
        $file = $this->request->file($this->uploadFileName);
        
        if (strtolower($file->getClientOriginalExtension()) !== "xlsx") {
            $errors = new MessageBag();
            $errors->add('Bad File', "File type must be XLSX.");
            dd($errors);
        } else {
            $result = $this->verifyUploadedFile($file);

            if (null !== $result) {
                return $result;
            }
        }

        return null;
    }

    public function verifyUploadedFile($file)
    {
        $fileReader = IOFactory::createReader(ucwords(strtolower($file->getClientOriginalExtension())));
        $fileReader->setReadDataOnly(false);
        $fileReader->setReadEmptyCells(false);
        
        $fileData = $fileReader->load($file->getRealPath());

        //Use this variable to determine if the file should be committed to the DB. If count of errors is greater than 0 when all processing is done, then return to the upload page with the errors
        $errors = new MessageBag();

        $sheetData = [];
        // foreach($this->wantedSheetNames as $sheetName) {
            $worksheet = $sheetData['worksheet'] = $fileData->getSheet(0);
            
            $headings1 = $sheetData['headings1'] = $worksheet->rangeToArray('A1:'.$worksheet->getHighestColumn().'1', NULL, TRUE, FALSE)[0];
            $headings2 = $sheetData['headings2'] = $worksheet->rangeToArray('A2:'.$worksheet->getHighestColumn().'2', NULL, TRUE, FALSE)[0];

            $data = [];

            foreach ($worksheet->getRowIterator() as $row) {
                //Skip the first row since it holds the headings
                if($row->getRowIndex() > 2) {
                    $rowData = [];
                    $cellIterator = $row->getCellIterator();
                    $cellIterator->setIterateOnlyExistingCells(FALSE);
                    $cellIndex = 0;

                    $is_row_empty = true;

                    foreach ($cellIterator as $cell) {
                        if($cell->getValue() !== null && trim($cell->getValue()) !== '') {
                            $is_row_empty = false;
                        }
                        $rowData[$headings2[$cellIndex]] = $cell->getFormattedValue();
                        $cellIndex++;
                    }

                    if(!$is_row_empty) {
                        $data[] = $rowData;
                    }
                }
            }
            $sheetData['data'] = $data;
        // }

        unset($fileReader);

        if($errors->any()) {
            dd($errors);
        } else {
            try {
                DB::beginTransaction();
                $this->parseData($sheetData);
                DB::commit();
            } catch (\Exception $e) {
               DB::rollback();
               $errors->add('dbException', $e->getMessage());
               dd($errors);
            }

            dd('finished');
            // return view($this->viewPath)->with('uploadComplete', true)->with('uploadMessage', $this->uploadSuccessMessage)->with('uploadChoices', $uploadChoices);
        }
    }

    public function parseData(array $sheetData) {
        $individuals = [];
        $households = [];
        $now = Carbon::now();

        foreach($sheetData['data'] as $row) {
            $brotherId = null;
            $sisterId = null;

            if(!empty($row['Brother'])) {
                $brother = Individuals::firstOrNew([
                    'name' => $row['Brother'],
                    'last_name' => $row['Families'],
                    'uniqueId' => $row['Unique']
                ]);

                $brother->fill([
                    'gender' => 'M',
                    'updated_at' => $now,
                    'status' => $row['Status']
                ]);

                if(!$brother->exists) {
                    $brother->created_at = $now;
                }

                $brother->save();
                $individuals[] = $brother;
                $brotherId = $brother->id;
            }

            if(!empty($row['Sister'])) {
                $sister = Individuals::firstOrNew([
                    'name' => $row['Sister'],
                    'last_name' => $row['Families'],
                    'uniqueId' => $row['Unique']
                ]);

                $sister->fill([
                    'gender' => 'F',
                    'updated_at' => $now,
                    'status' => $row['Status']
                ]);

                if(!$sister->exists) {
                    $sister->created_at = $now;
                }
                
                $sister->save();
                $individuals[] = $sister;
                $sisterId = $sister->id;
            }

            $household = Households::firstOrNew([
                'husband_id' => $brotherId,
                'wife_id' => $sisterId
            ]);

            $household->fill([
                'last_name' => $row['Families'],
                'updated_at' => $now
            ]);

            if(!$household->exists) {
                $household->created_at = $now;
            }

            $household->save();

            $households[] = $household;
        }

        return true;
    }
}