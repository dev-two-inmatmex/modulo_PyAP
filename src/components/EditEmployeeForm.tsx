"use client"

import { updateAvatar } from "@/app/(roles)/rh/empleados/actions";
import { Button } from "@/components/ui/button";
import { Human, Result } from "@vladmandic/human";
import { ChangeEvent, useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface EditFormProps {
    employeeId: string;
}

const EditForm = ({ employeeId }: EditFormProps) => {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [humanResult, setHumanResult] = useState<Result | null>(null);
    const cropperRef = useRef<any>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = async () => {
        if (cropperRef.current) {
            const imageElement = cropperRef?.current;
            const cropper = imageElement?.cropper;
            const canvas = cropper.getCroppedCanvas();

            const human = new Human();
            const result: Result = await human.detect(canvas);
            setHumanResult(result);
        }
    };

    const handleSubmit = async () => {
        if (cropperRef.current) {
            setLoading(true);
            const imageElement = cropperRef?.current;
            const cropper = imageElement?.cropper;

            cropper.getCroppedCanvas().toBlob(async (blob: any) => {
                if (blob) {
                    const formData = new FormData();
                    formData.append("avatar", blob);
                    formData.append("employeeId", employeeId);

                    if (humanResult && humanResult.face.length > 0) {
                        formData.append("face_descriptor", JSON.stringify(humanResult.face[0].embedding));
                    }

                    await updateAvatar(formData);
                    setLoading(false);
                }
            }, "image/webp", 0.8);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {image && (
                <>
                    <Cropper
                        src={image}
                        style={{ height: 400, width: "100%" }}
                        aspectRatio={1}
                        guides={false}
                        ref={cropperRef}
                    />
                    <Button onClick={handleCrop} disabled={loading}>
                        Analizar rostro
                    </Button>
                </>
            )}
            {humanResult && humanResult.face.length > 0 && (
                <div>
                    <p>Rostro detectado!</p>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Subiendo..." : "Subir avatar"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EditForm;